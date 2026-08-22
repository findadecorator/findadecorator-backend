import { Request, Response } from "express";
import { budgetEstimatorSchema, paintCalculatorSchema, surfaceAreaSchema, templateSchema, wallpaperCalculatorSchema } from "./schema";
import {
  calculatePaint,
  calculateSurfaceArea,
  calculateWallpaper,
  estimateBudget,
  generateQuoteTemplate,
  getColourGuide,
  getPrepChecklist
} from "./service";

export function paintCalculatorController(req: Request, res: Response) {
  const parsed = paintCalculatorSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (["matt", "satin", "gloss"].includes(data.paintType) === false) return res.status(400).json({ error: "Invalid paintType" });
  if (data.roomLength <= 0 || data.roomWidth <= 0 || data.roomHeight <= 0 || data.paintCoverage <= 0) return res.status(400).json({ error: "Positive dimensions are required" });
  res.json(calculatePaint(data));
}

export function wallpaperCalculatorController(req: Request, res: Response) {
  const parsed = wallpaperCalculatorSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (data.wallWidth <= 0 || data.wallHeight <= 0 || data.rollWidth <= 0 || data.rollLength <= 0) return res.status(400).json({ error: "Positive wall and roll dimensions are required" });
  if (data.wastePercent < 0 || data.wastePercent > 30) return res.status(400).json({ error: "wastePercent must be between 0 and 30" });
  res.json(calculateWallpaper(data));
}

export function surfaceAreaController(req: Request, res: Response) {
  const parsed = surfaceAreaSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json(calculateSurfaceArea(parsed.data as any));
}

export function quoteTemplateController(req: Request, res: Response) {
  const parsed = templateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (data.rooms < 1) return res.status(400).json({ error: "rooms must be at least 1" });
  res.json(generateQuoteTemplate(data));
}

export function budgetEstimatorController(req: Request, res: Response) {
  const parsed = budgetEstimatorSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (["good", "average", "poor"].includes(data.condition) === false) return res.status(400).json({ error: "Invalid condition" });
  if (["standard", "premium"].includes(data.finish) === false) return res.status(400).json({ error: "Invalid finish" });
  res.json(estimateBudget(data));
}

export function prepChecklistController(_req: Request, res: Response) {
  res.json(getPrepChecklist());
}

export function colourGuideController(_req: Request, res: Response) {
  res.json(getColourGuide());
}
