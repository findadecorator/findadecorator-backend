import { z } from "zod";

export const createQuoteSchema = z.object({
  jobId: z.string().min(3),
  professionalId: z.string().min(3),
  lines: z.array(
    z.object({
      label: z.string().min(1),
      amountGbp: z.number().nonnegative()
    })
  ).min(1)
});

export const statusSchema = z.object({
  status: z.enum(["draft", "sent", "accepted", "declined"])
});

