import { Request, Response } from "express";
import { createQuoteSchema, statusSchema } from "./schema";
import { createQuote, listQuotes, updateQuoteStatus } from "./service";

export function listQuotesController(_req: Request, res: Response) {
  res.json(listQuotes());
}

export function createQuoteController(req: Request, res: Response) {
  const parsed = createQuoteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createQuote(parsed.data as any));
}

export function updateQuoteStatusController(req: Request, res: Response) {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const quote = updateQuoteStatus(String(req.params.quoteId), parsed.data.status as any);
  if (!quote) {
    res.status(404).json({ error: "Quote not found" });
    return;
  }
  res.json(quote);
}
