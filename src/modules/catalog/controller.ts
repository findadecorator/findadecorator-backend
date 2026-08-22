import { Request, Response } from "express";
import { productQuerySchema } from "./schema";
import { getFeaturedBrands, getRecommendations, listProducts } from "./service";

export function productsController(req: Request, res: Response) {
  const parsed = productQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json(listProducts(parsed.data.category));
}

export function recommendationsController(req: Request, res: Response) {
  const parsed = productQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  res.json(getRecommendations(parsed.data.jobType ?? "bedroom"));
}

export function featuredBrandsController(_req: Request, res: Response) {
  res.json(getFeaturedBrands());
}
