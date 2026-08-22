"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const session_1 = require("./middleware/session");
const auth_1 = require("./middleware/auth");
const router_1 = __importDefault(require("./modules/identity/router"));
const router_2 = __importDefault(require("./modules/clients/router"));
const router_3 = __importDefault(require("./modules/professionals/router"));
const router_4 = __importDefault(require("./modules/jobs/router"));
const router_5 = __importDefault(require("./modules/matching/router"));
const router_6 = __importDefault(require("./modules/leads/router"));
const router_7 = __importDefault(require("./modules/pricing/router"));
const router_8 = __importDefault(require("./modules/quotes/router"));
const router_9 = __importDefault(require("./modules/messaging/router"));
const router_10 = __importDefault(require("./modules/bookings/router"));
const router_11 = __importDefault(require("./modules/reviews/router"));
const router_12 = __importDefault(require("./modules/billing/router"));
const router_13 = __importDefault(require("./modules/notifications/router"));
const router_14 = __importDefault(require("./modules/trust/router"));
const router_15 = __importDefault(require("./modules/content/router"));
const router_16 = __importDefault(require("./modules/analytics/router"));
const router_17 = __importDefault(require("./modules/admin/router"));
const router_18 = __importDefault(require("./modules/tools/router"));
const router_19 = __importDefault(require("./modules/catalog/router"));
const router_20 = __importDefault(require("./modules/ai/router"));
const router_21 = __importDefault(require("./modules/automation/router"));
const router_22 = __importDefault(require("./modules/enterprise/router"));
const app = (0, express_1.default)();
const buckets = new Map();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json());
app.use(session_1.cookieParser);
app.use((req, res, next) => {
    const key = `${req.ip}:${req.path}`;
    const now = Date.now();
    const bucket = buckets.get(key) ?? { count: 0, resetAt: now + 60000 };
    if (now > bucket.resetAt) {
        bucket.count = 0;
        bucket.resetAt = now + 60000;
    }
    bucket.count += 1;
    buckets.set(key, bucket);
    if (bucket.count > 120) {
        res.status(429).json({ error: "Rate limit exceeded" });
        return;
    }
    next();
});
app.use((req, _res, next) => {
    console.log(JSON.stringify({
        type: "AUDIT_LOG",
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString()
    }));
    next();
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "find-a-decorator-backend" });
});
app.use("/api/identity", router_1.default);
app.use("/api/auth", router_1.default);
app.use("/api/user", router_1.default);
app.use("/api/clients", auth_1.requireAuth, router_2.default);
app.use("/api/professionals", auth_1.requireAuth, router_3.default);
app.use("/api/jobs", auth_1.requireAuth, router_4.default);
app.use("/api/matching", auth_1.requireAuth, router_5.default);
app.use("/api/leads", auth_1.requireAuth, router_6.default);
app.use("/api/pricing", router_7.default);
app.use("/api/quotes", auth_1.requireAuth, router_8.default);
app.use("/api/messaging", auth_1.requireAuth, router_9.default);
app.use("/api/messages", auth_1.requireAuth, router_9.default);
app.use("/api/bookings", auth_1.requireAuth, router_10.default);
app.use("/api/reviews", auth_1.requireAuth, router_11.default);
app.use("/api/billing", auth_1.requireAuth, router_12.default);
app.use("/api/notifications", auth_1.requireAuth, router_13.default);
app.use("/api/trust", auth_1.requireAuth, router_14.default);
app.use("/api/content", router_15.default);
app.use("/api/tools", auth_1.requireAuth, router_18.default);
app.use("/api/catalog", auth_1.requireAuth, router_19.default);
app.use("/api/ai", auth_1.requireAuth, router_20.default);
app.use("/api/automation", auth_1.requireAuth, router_21.default);
app.use("/api/enterprise", auth_1.requireAuth, router_22.default);
app.use("/api/analytics", (0, auth_1.requireRoles)(["admin", "support", "verifier"]), router_16.default);
app.use("/api/campaigns", auth_1.requireAuth, router_16.default);
app.use("/api/admin", (0, auth_1.requireRoles)(["admin", "support", "verifier"]), router_17.default);
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
exports.default = app;
