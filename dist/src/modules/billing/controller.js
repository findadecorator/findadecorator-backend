"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = checkoutController;
exports.webhookController = webhookController;
exports.invoicesController = invoicesController;
exports.receiptsController = receiptsController;
exports.receiptEmailController = receiptEmailController;
exports.statementsController = statementsController;
exports.vatSummaryController = vatSummaryController;
exports.refundController = refundController;
exports.listRefundsController = listRefundsController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function checkoutController(req, res) {
    const parsed = schema_1.checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createCheckout)({ ...parsed.data, packKind: parsed.data.packKind === "subscription" ? "subscription" : "payg" }));
}
function webhookController(req, res) {
    const parsed = schema_1.webhookSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const result = (0, service_1.processWebhook)(parsed.data);
    if (!result.idempotent && parsed.data.eventType === "checkout.session.completed") {
        const packKind = req.body.packKind === "subscription" ? "subscription" : "payg";
        (0, service_1.markCheckoutPaid)(parsed.data.paymentRef, String(req.body.professionalId ?? "pro_default"), Number(req.body.credits ?? 0), packKind);
    }
    res.json(result);
}
function invoicesController(req, res) {
    const professionalId = typeof req.query.professionalId === "string" ? req.query.professionalId : undefined;
    res.json((0, service_1.listInvoices)(professionalId));
}
function receiptsController(req, res) {
    const receipt = (0, service_1.getReceiptByInvoiceId)(String(req.params.invoiceId ?? ""));
    if (!receipt) {
        res.status(404).json({ error: "Receipt not found" });
        return;
    }
    res.json(receipt);
}
function receiptEmailController(req, res) {
    const { invoiceId, recipient } = req.body;
    if (!invoiceId || !recipient) {
        res.status(400).json({ error: "invoiceId and recipient are required" });
        return;
    }
    res.json((0, service_1.sendReceiptEmail)(invoiceId, recipient));
}
function statementsController(req, res) {
    const professionalId = String(req.query.professionalId ?? "");
    if (professionalId) {
        res.json((0, service_1.listStatements)(professionalId));
        return;
    }
    if (req.query.month) {
        const { professionalId: pid, month } = req.body;
        if (!pid || !month) {
            res.status(400).json({ error: "professionalId and month are required" });
            return;
        }
        res.json((0, service_1.generateStatementForProfessional)(pid, month));
        return;
    }
    res.json((0, service_1.listStatements)());
}
function vatSummaryController(_req, res) {
    res.json((0, service_1.getVatSummary)());
}
function refundController(req, res) {
    const parsed = schema_1.refundSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createRefund)(parsed.data));
}
function listRefundsController(_req, res) {
    res.json((0, service_1.listRefunds)());
}
