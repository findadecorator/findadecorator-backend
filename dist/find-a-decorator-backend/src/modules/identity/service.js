"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.logout = logout;
exports.verifySession = verifySession;
exports.resolveSessionFromRequest = resolveSessionFromRequest;
exports.verifyEmailToken = verifyEmailToken;
exports.issuePasswordReset = issuePasswordReset;
exports.resetPassword = resetPassword;
exports.verifyAdminMfa = verifyAdminMfa;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const users = new Map();
const usersByEmail = new Map();
const resetTokens = new Map();
const emailVerifyTokens = new Map();
const activeSessions = new Map();
const jwtSecret = process.env.JWT_SECRET ?? "find-a-decorator-local-dev-secret";
const sessionTtlMs = 1000 * 60 * 60 * 24 * 7;
function getOnboardingSteps(profileType) {
    const steps = {
        residential_customer: ["Complete profile", "Add address", "Add preferences"],
        commercial_customer: ["Add business details", "Add VAT number (optional)", "Add PO/reference fields"],
        self_employed_decorator: ["Add services", "Add regions", "Add insurance details", "Upload portfolio"],
        registered_company: ["Add company number", "Add VAT number", "Add team size", "Add regions", "Add services", "Add insurance details"],
        admin: ["Review access", "Set notifications", "Confirm MFA"]
    };
    return steps[profileType] ?? steps.residential_customer;
}
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function sanitizeUser(user) {
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
async function tryAudit(action, metadata) {
    try {
        await prisma_1.default.auditLog.create({
            data: {
                action,
                targetType: "identity",
                metadata: metadata
            }
        });
    }
    catch {
        // keep auth flow resilient if database is unavailable
    }
}
function createAuthToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: "1h" });
}
function createRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user.id, type: "refresh" }, jwtSecret, { expiresIn: "7d" });
}
function createSession(userId) {
    const sessionId = makeId("sid");
    activeSessions.set(sessionId, { userId, expiresAt: Date.now() + sessionTtlMs });
    return sessionId;
}
async function register(input) {
    const exists = usersByEmail.get(input.email.toLowerCase());
    if (exists) {
        throw new Error("Email already registered");
    }
    const profileType = (input.profileType ?? "residential_customer");
    const derivedRole = profileType === "admin" ? "admin" : profileType.includes("customer") ? "client" : "professional";
    const preferredMode = input.preferredMode === "advanced" ? "advanced" : "simple";
    const user = {
        id: makeId("usr"),
        email: input.email.toLowerCase(),
        passwordHash: await bcryptjs_1.default.hash(input.password, 10),
        name: input.name,
        role: (input.role ?? derivedRole),
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
async function login(email, password) {
    const user = usersByEmail.get(email.toLowerCase());
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
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
function logout(sessionId) {
    if (sessionId) {
        activeSessions.delete(sessionId);
    }
}
function verifySession(authHeader) {
    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }
    const token = authHeader.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
        const userId = String(payload.sub ?? "");
        const user = users.get(userId);
        return user ? sanitizeUser(user) : null;
    }
    catch {
        return null;
    }
}
function resolveSessionFromRequest(req) {
    const headerUser = verifySession(req.headers.authorization);
    if (headerUser) {
        return headerUser;
    }
    const cookies = req.cookies;
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
function verifyEmailToken(token) {
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
function issuePasswordReset(email) {
    const user = usersByEmail.get(email.toLowerCase());
    if (!user) {
        return null;
    }
    const token = makeId("reset");
    resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 1000 * 60 * 30 });
    return token;
}
async function resetPassword(token, newPassword) {
    const entry = resetTokens.get(token);
    if (!entry || Date.now() > entry.expiresAt) {
        throw new Error("Invalid or expired reset token");
    }
    const user = users.get(entry.userId);
    if (!user) {
        throw new Error("User not found");
    }
    user.passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
    users.set(user.id, user);
    resetTokens.delete(token);
}
function verifyAdminMfa(userId, code) {
    const user = users.get(userId);
    if (!user || !user.mfaRequired) {
        throw new Error("MFA is not required");
    }
    if (code !== "000000") {
        throw new Error("Invalid MFA code");
    }
    return true;
}
