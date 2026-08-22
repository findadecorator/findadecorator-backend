import { z } from "zod";

export const queueActionSchema = z.object({
  queue: z.enum(["verification", "moderation", "refund", "fraud"]),
  itemId: z.string().min(3),
  action: z.enum(["approve", "reject", "escalate"])
});

