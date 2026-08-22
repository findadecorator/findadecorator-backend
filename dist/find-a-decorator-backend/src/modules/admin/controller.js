"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationQueueController = verificationQueueController;
exports.moderationQueueController = moderationQueueController;
exports.refundQueueController = refundQueueController;
exports.fraudQueueController = fraudQueueController;
exports.pricingVersionsController = pricingVersionsController;
exports.metricsController = metricsController;
exports.ceoOverviewController = ceoOverviewController;
exports.auditLogsController = auditLogsController;
exports.queueActionController = queueActionController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function verificationQueueController(_req, res) {
    res.json((0, service_1.listVerificationQueue)());
}
function moderationQueueController(_req, res) {
    res.json((0, service_1.listModerationQueue)());
}
function refundQueueController(_req, res) {
    res.json((0, service_1.listRefundQueue)());
}
function fraudQueueController(_req, res) {
    res.json((0, service_1.listFraudQueue)());
}
function pricingVersionsController(_req, res) {
    res.json((0, service_1.getPricingVersionControl)());
}
function metricsController(_req, res) {
    res.json((0, service_1.getMarketplaceMetrics)());
}
function ceoOverviewController(_req, res) {
    res.json((0, service_1.getCeoOverview)());
}
function auditLogsController(_req, res) {
    res.json((0, service_1.listAuditLogs)());
}
function queueActionController(req, res) {
    const parsed = schema_1.queueActionSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.applyQueueAction)(parsed.data));
}
