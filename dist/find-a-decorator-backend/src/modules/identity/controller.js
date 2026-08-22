"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerController = registerController;
exports.loginController = loginController;
exports.logoutController = logoutController;
exports.meController = meController;
exports.verifyEmailController = verifyEmailController;
exports.forgotPasswordController = forgotPasswordController;
exports.resetPasswordController = resetPasswordController;
exports.adminMfaController = adminMfaController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function setSessionCookie(res, sessionId) {
    res.setHeader("Set-Cookie", `sid=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax`);
}
async function registerController(req, res) {
    const parsed = schema_1.registerSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const result = await (0, service_1.register)(parsed.data);
        setSessionCookie(res, result.sessionId);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(409).json({ error: error.message });
    }
}
async function loginController(req, res) {
    const parsed = schema_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const result = await (0, service_1.login)(parsed.data.email, parsed.data.password);
        setSessionCookie(res, result.sessionId);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
}
function logoutController(req, res) {
    const sid = req.cookies?.sid;
    (0, service_1.logout)(sid);
    res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
    res.json({ ok: true });
}
function meController(req, res) {
    const user = (0, service_1.resolveSessionFromRequest)(req);
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    res.json(user);
}
function verifyEmailController(req, res) {
    const parsed = schema_1.verifyEmailSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        const user = (0, service_1.verifyEmailToken)(parsed.data.token);
        res.json({ verified: true, user });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
function forgotPasswordController(req, res) {
    const parsed = schema_1.forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const token = (0, service_1.issuePasswordReset)(parsed.data.email);
    res.json({ ok: true, resetToken: token ?? null });
}
async function resetPasswordController(req, res) {
    const parsed = schema_1.resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        await (0, service_1.resetPassword)(parsed.data.token, parsed.data.newPassword);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
function adminMfaController(req, res) {
    const user = (0, service_1.resolveSessionFromRequest)(req);
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        (0, service_1.verifyAdminMfa)(user.id, String(req.body.code ?? ""));
        res.json({ ok: true });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
