import { z } from "zod";

export const createBookingSchema = z.object({
  jobId: z.string().min(3),
  quoteId: z.string().min(3),
  clientId: z.string().min(3),
  professionalId: z.string().min(3),
  startDate: z.string().min(8)
});

export const updateStatusSchema = z.object({
  status: z.enum(["created", "confirmed", "in_progress", "completed", "cancelled"])
});

