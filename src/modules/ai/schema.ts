import { z } from "zod";

export const quoteAssistantSchema = z.object({
  jobDescription: z.string().min(10),
  projectType: z.string().optional()
});

export const colourAdvisorSchema = z.object({
  roomPhotoUrl: z.string().optional(),
  roomStyle: z.string().optional()
});

export const jobClassifierSchema = z.object({
  jobDescription: z.string().min(10)
});
