import { z } from "zod";

export const pricingInputSchema = z.object({
  jobSize: z.enum(["small", "medium", "large", "enterprise"]),
  leadClass: z.enum(["standard", "premium", "high-value", "exclusive"]).default("standard"),
  distanceBand: z.enum(["local", "regional", "long_distance"]).default("local"),
  complexityBand: z.enum(["low", "medium", "high"]).default("medium"),
  timingBand: z.enum(["flexible", "normal", "urgent"]).default("normal"),
  qualityBand: z.enum(["standard", "premium"]).default("standard")
});
