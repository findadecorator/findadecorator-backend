import { Request, Response } from "express";
import { colourAdvisorSchema, jobClassifierSchema, quoteAssistantSchema } from "./schema";
import { classifyJob, suggestColourAdvisor, suggestQuoteAssistant } from "./service";

export function quoteAssistantController(req: Request, res: Response) {
  const parsed = quoteAssistantSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (!data.jobDescription || data.jobDescription.length < 10) return res.status(400).json({ error: "jobDescription must be at least 10 characters" });
  res.json(suggestQuoteAssistant(data));
}

export function colourAdvisorController(req: Request, res: Response) {
  const parsed = colourAdvisorSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (data.roomPhotoUrl && !/^https?:\/\//.test(String(data.roomPhotoUrl))) return res.status(400).json({ error: "roomPhotoUrl must be a valid http(s) URL" });
  res.json(suggestColourAdvisor(data));
}

export function jobClassifierController(req: Request, res: Response) {
  const parsed = jobClassifierSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const data = parsed.data as any;
  if (!data.jobDescription || data.jobDescription.length < 10) return res.status(400).json({ error: "jobDescription must be at least 10 characters" });
  res.json(classifyJob(data));
}
