"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRoles = requireRoles;
const service_1 = require("../modules/identity/service");
function requireAuth(req, res, next) {
    const user = (0, service_1.resolveSessionFromRequest)(req);
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    req.authUser = user;
    next();
}
function requireRoles(roles) {
    return (req, res, next) => {
        const user = (0, service_1.resolveSessionFromRequest)(req);
        if (!user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        if (!roles.includes(user.role)) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        req.authUser = user;
        next();
    };
}
