import { Request, Response } from "express";
import { queueActionSchema } from "./schema";
import {
  applyQueueAction,
  getCeoOverview,
  getMarketplaceMetrics,
  getPricingVersionControl,
  listAuditLogs,
  listFraudQueue,
  listModerationQueue,
  listRefundQueue,
  listVerificationQueue
} from "./service";

export function verificationQueueController(_req: Request, res: Response) {
  res.json(listVerificationQueue());
}

export function moderationQueueController(_req: Request, res: Response) {
  res.json(listModerationQueue());
}

export function refundQueueController(_req: Request, res: Response) {
  res.json(listRefundQueue());
}

export function fraudQueueController(_req: Request, res: Response) {
  res.json(listFraudQueue());
}

export function pricingVersionsController(_req: Request, res: Response) {
  res.json(getPricingVersionControl());
}

export function metricsController(_req: Request, res: Response) {
  res.json(getMarketplaceMetrics());
}

export function ceoOverviewController(_req: Request, res: Response) {
  res.json(getCeoOverview());
}

export function auditLogsController(_req: Request, res: Response) {
  res.json(listAuditLogs());
}

export function queueActionController(req: Request, res: Response) {
  const parsed = queueActionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(applyQueueAction(parsed.data));
}

