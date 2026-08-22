import { z } from "zod";

export const createSchema = z.object({
  name: z.string().min(1),
  status: z.string().default("active"),
  metadata: z.record(z.any()).optional()
});

export const updateSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;