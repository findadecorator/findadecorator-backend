import { z } from "zod";

export const jobStatusSchema = z.enum([
  "draft",
  "submitted",
  "review",
  "live",
  "matched",
  "quoted",
  "booked",
  "completed",
  "cancelled",
  "archived"
]);

export const createJobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  postcode: z.string().min(3),
  serviceType: z.string().min(1).default("painting"),
  jobSize: z.enum(["small", "medium", "large", "enterprise"]).default("small")
});
