"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listLeadsController = listLeadsController;
exports.createLeadController = createLeadController;
exports.previewLeadController = previewLeadController;
exports.unlockLeadController = unlockLeadController;
exports.topUpController = topUpController;
exports.walletController = walletController;
exports.ledgerController = ledgerController;
exports.requestRefundController = requestRefundController;
exports.listRefundsController = listRefundsController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listLeadsController(_req, res) {
    res.json((0, service_1.listLeads)());
}
function createLeadController(req, res) {
    const parsed = schema_1.createLeadSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createLead)(parsed.data));
}
function previewLeadController(req, res) {
    const parsed = schema_1.previewSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        res.json((0, service_1.previewLead)(parsed.data.leadId, parsed.data.professionalId));
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}
function unlockLeadController(req, res) {
    const parsed = schema_1.unlockLeadSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        res.json((0, service_1.unlockLead)(parsed.data));
    }
    catch (error) {
        const message = error.message;
        if (message === "Insufficient credits") {
            res.status(402).json({ error: message, action: "Top Up Credits" });
            return;
        }
        res.status(409).json({ error: message });
    }
}
function topUpController(req, res) {
    const professionalId = String(req.body.professionalId ?? "");
    const credits = Number(req.body.credits ?? 0);
    if (!professionalId || credits <= 0) {
        res.status(400).json({ error: "professionalId and positive credits are required" });
        return;
    }
    res.status(201).json((0, service_1.topUpCredits)(professionalId, credits, "credit-pack-purchase"));
}
function walletController(req, res) {
    const professionalId = String(req.query.professionalId ?? "");
    if (!professionalId) {
        res.status(400).json({ error: "professionalId query is required" });
        return;
    }
    res.json((0, service_1.getCreditBalances)(professionalId));
}
function ledgerController(req, res) {
    const professionalId = req.query.professionalId ? String(req.query.professionalId) : undefined;
    res.json((0, service_1.listLedger)(professionalId));
}
function requestRefundController(req, res) {
    const parsed = schema_1.refundSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        res.status(201).json((0, service_1.requestRefund)(parsed.data.unlockId, parsed.data.reason));
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}
function listRefundsController(_req, res) {
    res.json((0, service_1.listRefunds)());
}
