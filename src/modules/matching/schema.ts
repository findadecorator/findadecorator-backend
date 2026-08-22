import { z } from "zod";

export const runMatchSchema = z.object({
  jobId: z.string().min(3),
  region: z.string().min(1),
  serviceType: z.string().min(1).default("painting")
});

