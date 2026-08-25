import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { calculateDeterministicLeadPrice } from "../pricing-engine/engine";
import { getActivePricingRuleVersion } from "../pricing-engine/versioning";

export const prisma = new PrismaClient();
export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true, status: "healthy", service: "find-a-decorator-backend" });
});

app.get("/pricing/active-version", (_req: Request, res: Response) => {
  res.json({ ok: true, version: getActivePricingRuleVersion() });
});

app.post("/pricing/quote", (req: Request, res: Response) => {
  const { jobSize = "medium", anchorValueGbp = 2000, distanceBand = "local", complexity = "medium", timing = "normal", quality = "standard" } = req.body ?? {};

  const result = calculateDeterministicLeadPrice({
    jobSize,
    anchorValueGbp,
    distanceBand,
    complexity,
    timing,
    quality
  });

  res.json({ ok: true, data: result });
});

app.get("/pricing/rules", (_req: Request, res: Response) => {
  res.json({ ok: true, rules: getActivePricingRuleVersion() });
});

app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Find A Decorator backend is running." });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ ok: false, message: "Internal server error" });
});

const port = Number(process.env.PORT ?? 5000);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
