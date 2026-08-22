import { z } from "zod";

export const createReviewSchema = z.object({
  jobId: z.string().min(3),
  bookingId: z.string().min(3),
  reviewerId: z.string().min(3),
  rating: z.number(),
  body: z.string().min(5)
});

export const moderationSchema = z.object({
  reviewId: z.string().min(3),
  action: z.enum(["approve", "hide", "flag"])
});

export const appealSchema = z.object({
  reviewId: z.string().min(3),
  appellantId: z.string().min(3),
  reason: z.string().min(3)
});

