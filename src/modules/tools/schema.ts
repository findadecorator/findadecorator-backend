import { z } from "zod";

export const paintCalculatorSchema = z.object({
  roomLength: z.number().min(0),
  roomWidth: z.number().min(0),
  roomHeight: z.number().min(0),
  coats: z.number().min(1),
  paintCoverage: z.number().min(0),
  paintType: z.enum(["matt", "satin", "gloss"]).default("matt")
});

export const wallpaperCalculatorSchema = z.object({
  wallWidth: z.number().min(0),
  wallHeight: z.number().min(0),
  patternRepeat: z.number().nonnegative(),
  wastePercent: z.number().nonnegative(),
  rollWidth: z.number().min(0),
  rollLength: z.number().min(0)
});

export const surfaceAreaSchema = z.object({
  wallArea: z.number().nonnegative(),
  ceilingArea: z.number().nonnegative(),
  trimArea: z.number().nonnegative(),
  doorArea: z.number().nonnegative(),
  windowArea: z.number().nonnegative()
});

export const templateSchema = z.object({
  projectType: z.string().min(2),
  rooms: z.number().min(1),
  finishType: z.enum(["standard", "premium"]).default("standard")
});

export const budgetEstimatorSchema = z.object({
  rooms: z.number().min(1),
  condition: z.enum(["good", "average", "poor"]).default("average"),
  finish: z.enum(["standard", "premium"]).default("standard")
});
