import { z } from "zod";

export const sendNotificationSchema = z.object({
  userId: z.string().min(3),
  type: z.string().min(2),
  channel: z.enum(["email", "in_app"]),
  payload: z.record(z.any())
});

export const preferenceSchema = z.object({
  userId: z.string().min(3),
  channel: z.enum(["email", "in_app"]),
  enabled: z.boolean()
});

