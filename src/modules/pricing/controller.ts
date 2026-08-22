import { Request, Response } from "express";
import { pricingInputSchema } from "./schema";
import { calculatePrice, getRules, getRuleVersions } from "./service";

export function getRulesController(_req: Request, res: Response) {
  res.json(getRules());
}

export function getRuleVersionsController(_req: Request, res: Response) {
  res.json(getRuleVersions());
}

export function quoteController(req: Request, res: Response) {
  const parsed = pricingInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.json(calculatePrice(parsed.data as any));
}
