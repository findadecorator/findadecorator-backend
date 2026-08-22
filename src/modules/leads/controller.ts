import { Request, Response } from "express";
import { createLeadSchema, previewSchema, refundSchema, unlockLeadSchema } from "./schema";
import { createLead, getCreditBalances, listLedger, listLeads, listRefunds, previewLead, requestRefund, topUpCredits, unlockLead } from "./service";

export function listLeadsController(_req: Request, res: Response) {
  res.json(listLeads());
}

export function createLeadController(req: Request, res: Response) {
  const parsed = createLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createLead(parsed.data as any));
}

export function previewLeadController(req: Request, res: Response) {
  const parsed = previewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    res.json(previewLead(parsed.data.leadId, parsed.data.professionalId));
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export function unlockLeadController(req: Request, res: Response) {
  const parsed = unlockLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    res.json(unlockLead(parsed.data as any));
  } catch (error) {
    const message = (error as Error).message;
    if (message === "Insufficient credits") {
      res.status(402).json({ error: message, action: "Top Up Credits" });
      return;
    }
    res.status(409).json({ error: message });
  }
}

export function topUpController(req: Request, res: Response) {
  const professionalId = String(req.body.professionalId ?? "");
  const credits = Number(req.body.credits ?? 0);
  if (!professionalId || credits <= 0) {
    res.status(400).json({ error: "professionalId and positive credits are required" });
    return;
  }
  res.status(201).json(topUpCredits(professionalId, credits, "credit-pack-purchase"));
}

export function walletController(req: Request, res: Response) {
  const professionalId = String(req.query.professionalId ?? "");
  if (!professionalId) {
    res.status(400).json({ error: "professionalId query is required" });
    return;
  }
  res.json(getCreditBalances(professionalId));
}

export function ledgerController(req: Request, res: Response) {
  const professionalId = req.query.professionalId ? String(req.query.professionalId) : undefined;
  res.json(listLedger(professionalId));
}

export function requestRefundController(req: Request, res: Response) {
  const parsed = refundSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(requestRefund(parsed.data.unlockId, parsed.data.reason));
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
}

export function listRefundsController(_req: Request, res: Response) {
  res.json(listRefunds());
}
