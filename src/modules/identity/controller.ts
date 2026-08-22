import { Request, Response } from "express";
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyEmailSchema } from "./schema";
import {
  issuePasswordReset,
  login,
  logout,
  register,
  resetPassword,
  resolveSessionFromRequest,
  verifyAdminMfa,
  verifyEmailToken
} from "./service";

function setSessionCookie(res: Response, sessionId: string) {
  res.setHeader("Set-Cookie", `sid=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax`);
}

export async function registerController(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const result = await register(parsed.data);
    setSessionCookie(res, result.sessionId);
    res.status(201).json(result);
  } catch (error) {
    res.status(409).json({ error: (error as Error).message });
  }
}

export async function loginController(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const result = await login(parsed.data.email, parsed.data.password);
    setSessionCookie(res, result.sessionId);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
}

export function logoutController(req: Request, res: Response) {
  const sid = (req as Request & { cookies?: Record<string, string> }).cookies?.sid;
  logout(sid);
  res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  res.json({ ok: true });
}

export function meController(req: Request, res: Response) {
  const user = resolveSessionFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json(user);
}

export function verifyEmailController(req: Request, res: Response) {
  const parsed = verifyEmailSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    const user = verifyEmailToken(parsed.data.token);
    res.json({ verified: true, user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export function forgotPasswordController(req: Request, res: Response) {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const token = issuePasswordReset(parsed.data.email);
  res.json({ ok: true, resetToken: token ?? null });
}

export async function resetPasswordController(req: Request, res: Response) {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    await resetPassword(parsed.data.token, parsed.data.newPassword);
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export function adminMfaController(req: Request, res: Response) {
  const user = resolveSessionFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    verifyAdminMfa(user.id, String(req.body.code ?? ""));
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

