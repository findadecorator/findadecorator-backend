import { z } from "zod";

export const createLeadSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  region: z.string().min(1),
  jobSize: z.enum(["small", "medium", "large", "enterprise"]).default("small"),
  complexityBand: z.enum(["low", "medium", "high"]).default("medium"),
  timingBand: z.enum(["flexible", "normal", "urgent"]).default("normal"),
  qualityBand: z.enum(["standard", "premium"]).default("standard"),
  distanceBand: z.enum(["local", "regional", "long_distance"]).default("local"),
  valueAnchorGbp: z.number().nonnegative().default(280),
  professionalRating: z.number().default(4.5)
});

export const unlockLeadSchema = z.object({
  leadId: z.string().min(3),
  professionalId: z.string().min(3),
  idempotencyKey: z.string().min(8)
});

export const previewSchema = z.object({
  leadId: z.string().min(3),
  professionalId: z.string().min(3)
});

export const refundSchema = z.object({
  unlockId: z.string().min(3),
  reason: z.string().min(5)
});
