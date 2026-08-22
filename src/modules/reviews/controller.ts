import { Request, Response } from "express";
import { appealSchema, createReviewSchema, moderationSchema } from "./schema";
import { createAppeal, createReview, listAppeals, listReviews, moderateReview } from "./service";

export function listReviewsController(_req: Request, res: Response) {
  res.json(listReviews());
}

export function createReviewController(req: Request, res: Response) {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createReview(parsed.data as any));
}

export function moderateReviewController(req: Request, res: Response) {
  const parsed = moderationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const review = moderateReview(parsed.data.reviewId, parsed.data.action as any);
  if (!review) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(review);
}

export function appealController(req: Request, res: Response) {
  const parsed = appealSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createAppeal(parsed.data));
}

export function listAppealsController(_req: Request, res: Response) {
  res.json(listAppeals());
}
