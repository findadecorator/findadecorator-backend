import { z } from "zod";

export const enterpriseSchema = z.object({
  companyId: z.string().optional(),
  region: z.string().optional()
});
