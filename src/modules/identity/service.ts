import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { RegisterInput } from "./schema";
import prisma from "../../lib/prisma";

export type ProfileType = "residential_customer" | "commercial_customer" | "self_employed_decorator" | "registered_company" | "admin";

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: "guest" | "client" | "professional" | "verifier" | "support" | "admin";
  emailVerified: boolean;
  mfaRequired: boolean;
  profileType: ProfileType;
  businessName?: string;
  companyNumber?: string;
  vatNumber?: string;
  isVatRegistered: boolean;
  businessType?: string;
  regionsCovered: string[];
  servicesOffered: string[];
  insuranceDetails?: string;
  portfolioLinks: string[];
  teamSize?: number;
  preferredMode: "simple" | "advanced";
}

interface IdentityUser extends SessionUser {
  passwordHash: string;
}

const users = new Map<string, IdentityUser>();
const usersByEmail = new Map<string, IdentityUser>();
const resetTokens = new Map<string, { userId: string; expiresAt: number }>();
const emailVerifyTokens = new Map<string, { userId: string; expiresAt: number }>();
const activeSessions = new Map<string, { userId: string; expiresAt: number }>();

const jwtSecret = process.env.JWT_SECRET ?? "find-a-decorator-local-dev-secret";
const sessionTtlMs = 1000 * 60 * 60 * 24 * 7;

function getOnboardingSteps(profileType: ProfileType) {
  const steps: Record<ProfileType, string[]> = {
    residential_customer: ["Complete profile", "Add address", "Add preferences"],
    commercial_customer: ["Add business details", "Add VAT number (optional)", "Add PO/reference fields"],
    self_employed_decorator: ["Add services", "Add regions", "Add insurance details", "Upload portfolio"],
    registered_company: ["Add company number", "Add VAT number", "Add team size", "Add regions", "Add services", "Add insurance details"],
    admin: ["Review access", "Set notifications", "Confirm MFA"]
  };
  return steps[profileType] ?? steps.residential_customer;
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function sanitizeUser(user: IdentityUser): SessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    mfaRequired: user.mfaRequired,
    profileType: user.profileType,
    businessName: user.businessName,
    companyNumber: user.companyNumber,
    vatNumber: user.vatNumber,
    isVatRegistered: user.isVatRegistered,
    businessType: user.businessType,
    regionsCovered: user.regionsCovered ?? [],
    servicesOffered: user.servicesOffered ?? [],
    insuranceDetails: user.insuranceDetails,
    portfolioLinks: user.portfolioLinks ?? [],
    teamSize: user.teamSize,
    preferredMode: user.preferredMode
  };
}

async function tryAudit(action: string, metadata?: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        targetType: "identity",
        metadata: metadata as any
      }
    });
  } catch {
    // keep auth flow resilient if database is unavailable
  }
}

function createAuthToken(user: IdentityUser): string {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: "1h" });
}

function createRefreshToken(user: IdentityUser): string {
  return jwt.sign({ sub: user.id, type: "refresh" }, jwtSecret, { expiresIn: "7d" });
}

function createSession(userId: string): string {
  const sessionId = makeId("sid");
  activeSessions.set(sessionId, { userId, expiresAt: Date.now() + sessionTtlMs });
  return sessionId;
}

export async function register(input: RegisterInput) {
  const exists = usersByEmail.get(input.email.toLowerCase());
  if (exists) {
    throw new Error("Email already registered");
  }

  const profileType = (input.profileType ?? "residential_customer") as ProfileType;
  const derivedRole: SessionUser["role"] = profileType === "admin" ? "admin" : profileType.includes("customer") ? "client" : "professional";

  const preferredMode: SessionUser["preferredMode"] =
    input.preferredMode === "advanced" ? "advanced" : "simple";

  const user: IdentityUser = {
    id: makeId("usr"),
    email: input.email.toLowerCase(),
    passwordHash: await bcrypt.hash(input.password, 10),
    name: input.name,
    role: (input.role ?? derivedRole) as SessionUser["role"],
    emailVerified: false,
    mfaRequired: input.role === "admin" || profileType === "admin",
    profileType,
    businessName: input.businessName,
    companyNumber: input.companyNumber,
    vatNumber: input.vatNumber,
    isVatRegistered: Boolean(input.isVatRegistered),
    businessType: input.businessType,
    regionsCovered: input.regionsCovered ?? [],
    servicesOffered: input.servicesOffered ?? [],
    insuranceDetails: input.insuranceDetails,
    portfolioLinks: input.portfolioLinks ?? [],
    teamSize: input.teamSize,
    preferredMode
  };

  users.set(user.id, user);
  usersByEmail.set(user.email, user);
  const emailToken = makeId("verify");
  emailVerifyTokens.set(emailToken, { userId: user.id, expiresAt: Date.now() + 1000 * 60 * 60 * 24 });
  await tryAudit("identity.register", { userId: user.id });

  return {
    user: sanitizeUser(user),
    token: createAuthToken(user),
    refreshToken: createRefreshToken(user),
    sessionId: createSession(user.id),
    emailVerificationToken: emailToken,
    onboardingSteps: getOnboardingSteps(profileType)
  };
}

export async function login(email: string, password: string) {
  const user = usersByEmail.get(email.toLowerCase());
  if (!user) {
    throw new Error("Invalid credentials");
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid credentials");
  }
  await tryAudit("identity.login", { userId: user.id });
  return {
    user: sanitizeUser(user),
    token: createAuthToken(user),
    refreshToken: createRefreshToken(user),
    sessionId: createSession(user.id),
    mfaRequired: user.mfaRequired,
    onboardingSteps: getOnboardingSteps(user.profileType)
  };
}

export function logout(sessionId: string | undefined) {
  if (sessionId) {
    activeSessions.delete(sessionId);
  }
}

export function verifySession(authHeader: string | undefined): SessionUser | null {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload;
    const userId = String(payload.sub ?? "");
    const user = users.get(userId);
    return user ? sanitizeUser(user) : null;
  } catch {
    return null;
  }
}

export function resolveSessionFromRequest(req: Request): SessionUser | null {
  const headerUser = verifySession(req.headers.authorization);
  if (headerUser) {
    return headerUser;
  }

  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
  const sessionId = cookies?.sid;
  if (!sessionId) {
    return null;
  }
  const session = activeSessions.get(sessionId);
  if (!session || Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return null;
  }
  const user = users.get(session.userId);
  return user ? sanitizeUser(user) : null;
}

export function verifyEmailToken(token: string) {
  const entry = emailVerifyTokens.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    throw new Error("Invalid or expired verification token");
  }
  emailVerifyTokens.delete(token);
  const user = users.get(entry.userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.emailVerified = true;
  users.set(user.id, user);
  return sanitizeUser(user);
}

export function issuePasswordReset(email: string) {
  const user = usersByEmail.get(email.toLowerCase());
  if (!user) {
    return null;
  }
  const token = makeId("reset");
  resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 1000 * 60 * 30 });
  return token;
}

export async function resetPassword(token: string, newPassword: string) {
  const entry = resetTokens.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    throw new Error("Invalid or expired reset token");
  }
  const user = users.get(entry.userId);
  if (!user) {
    throw new Error("User not found");
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  users.set(user.id, user);
  resetTokens.delete(token);
}

export function verifyAdminMfa(userId: string, code: string) {
  const user = users.get(userId);
  if (!user || !user.mfaRequired) {
    throw new Error("MFA is not required");
  }
  if (code !== "000000") {
    throw new Error("Invalid MFA code");
  }
  return true;
}

