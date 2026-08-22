import cors from "cors";
import express from "express";
import { cookieParser } from "./middleware/session";
import { requireAuth, requireRoles } from "./middleware/auth";
import identityRouter from "./modules/identity/router";
import clientsRouter from "./modules/clients/router";
import professionalsRouter from "./modules/professionals/router";
import jobsRouter from "./modules/jobs/router";
import matchingRouter from "./modules/matching/router";
import leadsRouter from "./modules/leads/router";
import pricingRouter from "./modules/pricing/router";
import quotesRouter from "./modules/quotes/router";
import messagingRouter from "./modules/messaging/router";
import bookingsRouter from "./modules/bookings/router";
import reviewsRouter from "./modules/reviews/router";
import billingRouter from "./modules/billing/router";
import notificationsRouter from "./modules/notifications/router";
import trustRouter from "./modules/trust/router";
import contentRouter from "./modules/content/router";
import analyticsRouter from "./modules/analytics/router";
import adminRouter from "./modules/admin/router";
import toolsRouter from "./modules/tools/router";
import catalogRouter from "./modules/catalog/router";
import aiRouter from "./modules/ai/router";
import automationRouter from "./modules/automation/router";
import enterpriseRouter from "./modules/enterprise/router";

const app = express();

const buckets = new Map<string, { count: number; resetAt: number }>();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser);
app.use((req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  const now = Date.now();
  const bucket = buckets.get(key) ?? { count: 0, resetAt: now + 60_000 };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + 60_000;
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
  console.log(
    JSON.stringify({
      type: "AUDIT_LOG",
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString()
    })
  );
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "find-a-decorator-backend" });
});

app.use("/api/identity", identityRouter);
app.use("/api/auth", identityRouter);
app.use("/api/user", identityRouter);
app.use("/api/clients", requireAuth, clientsRouter);
app.use("/api/professionals", requireAuth, professionalsRouter);
app.use("/api/jobs", requireAuth, jobsRouter);
app.use("/api/matching", requireAuth, matchingRouter);
app.use("/api/leads", requireAuth, leadsRouter);
app.use("/api/pricing", pricingRouter);
app.use("/api/quotes", requireAuth, quotesRouter);
app.use("/api/messaging", requireAuth, messagingRouter);
app.use("/api/messages", requireAuth, messagingRouter);
app.use("/api/bookings", requireAuth, bookingsRouter);
app.use("/api/reviews", requireAuth, reviewsRouter);
app.use("/api/billing", requireAuth, billingRouter);
app.use("/api/notifications", requireAuth, notificationsRouter);
app.use("/api/trust", requireAuth, trustRouter);
app.use("/api/content", contentRouter);
app.use("/api/tools", requireAuth, toolsRouter);
app.use("/api/catalog", requireAuth, catalogRouter);
app.use("/api/ai", requireAuth, aiRouter);
app.use("/api/automation", requireAuth, automationRouter);
app.use("/api/enterprise", requireAuth, enterpriseRouter);
app.use("/api/analytics", requireRoles(["admin", "support", "verifier"]), analyticsRouter);
app.use("/api/campaigns", requireAuth, analyticsRouter);
app.use("/api/admin", requireRoles(["admin", "support", "verifier"]), adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
