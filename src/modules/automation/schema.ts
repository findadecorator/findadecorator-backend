import { z } from "zod";

export const automationSchema = z.object({
  type: z.string().optional(),
  userId: z.string().optional()
});
