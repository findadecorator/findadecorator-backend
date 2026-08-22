import { Request, Response } from "express";
import { checkoutSchema, refundSchema, webhookSchema } from "./schema";
import {
  createCheckout,
  createRefund,
  generateStatementForProfessional,
  getReceiptByInvoiceId,
  getVatSummary,
  listInvoices,
  listRefunds,
  listStatements,
  markCheckoutPaid,
  processWebhook,
  sendReceiptEmail
} from "./service";

export function checkoutController(req: Request, res: Response) {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createCheckout({ ...parsed.data, packKind: parsed.data.packKind === "subscription" ? "subscription" : "payg" }));
}

export function webhookController(req: Request, res: Response) {
  const parsed = webhookSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const result = processWebhook(parsed.data);
  if (!result.idempotent && parsed.data.eventType === "checkout.session.completed") {
    const packKind = req.body.packKind === "subscription" ? "subscription" : "payg";
    markCheckoutPaid(
      parsed.data.paymentRef,
      String(req.body.professionalId ?? "pro_default"),
      Number(req.body.credits ?? 0),
      packKind
    );
  }
  res.json(result);
}

export function invoicesController(req: Request, res: Response) {
  const professionalId = typeof req.query.professionalId === "string" ? req.query.professionalId : undefined;
  res.json(listInvoices(professionalId));
}

export function receiptsController(req: Request, res: Response) {
  const receipt = getReceiptByInvoiceId(String(req.params.invoiceId ?? ""));
  if (!receipt) {
    res.status(404).json({ error: "Receipt not found" });
    return;
  }
  res.json(receipt);
}

export function receiptEmailController(req: Request, res: Response) {
  const { invoiceId, recipient } = req.body as { invoiceId?: string; recipient?: string };
  if (!invoiceId || !recipient) {
    res.status(400).json({ error: "invoiceId and recipient are required" });
    return;
  }
  res.json(sendReceiptEmail(invoiceId, recipient));
}

export function statementsController(req: Request, res: Response) {
  const professionalId = String(req.query.professionalId ?? "");
  if (professionalId) {
    res.json(listStatements(professionalId));
    return;
  }
  if (req.query.month) {
    const { professionalId: pid, month } = req.body as { professionalId?: string; month?: string };
    if (!pid || !month) {
      res.status(400).json({ error: "professionalId and month are required" });
      return;
    }
    res.json(generateStatementForProfessional(pid, month));
    return;
  }
  res.json(listStatements());
}

export function vatSummaryController(_req: Request, res: Response) {
  res.json(getVatSummary());
}

export function refundController(req: Request, res: Response) {
  const parsed = refundSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createRefund(parsed.data));
}

export function listRefundsController(_req: Request, res: Response) {
  res.json(listRefunds());
}
