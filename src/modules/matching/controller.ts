import { Request, Response } from "express";
import { runMatchSchema } from "./schema";
import { runMatching } from "./service";

export function runMatchingController(req: Request, res: Response) {
  const parsed = runMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.json({ matches: runMatching(parsed.data) });
}

