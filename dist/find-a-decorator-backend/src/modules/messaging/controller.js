"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConversationsController = listConversationsController;
exports.createConversationController = createConversationController;
exports.listMessagesController = listMessagesController;
exports.sendMessageController = sendMessageController;
exports.markReadController = markReadController;
exports.blockController = blockController;
exports.reportController = reportController;
exports.listReportsController = listReportsController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listConversationsController(req, res) {
    res.json((0, service_1.listConversations)(String(req.query.userId ?? "")));
}
function createConversationController(req, res) {
    const parsed = schema_1.createConversationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createConversation)(parsed.data));
}
function listMessagesController(req, res) {
    res.json({ messages: (0, service_1.listMessages)(String(req.params.conversationId)) });
}
function sendMessageController(req, res) {
    const parsed = schema_1.sendMessageSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    try {
        res.status(201).json((0, service_1.sendMessage)(String(req.params.conversationId), parsed.data));
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
function markReadController(req, res) {
    const parsed = schema_1.readReceiptSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.json((0, service_1.markRead)(parsed.data.messageId, parsed.data.userId));
}
function blockController(req, res) {
    const parsed = schema_1.blockSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.addBlock)(parsed.data));
}
function reportController(req, res) {
    const parsed = schema_1.reportSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.addReport)(parsed.data));
}
function listReportsController(_req, res) {
    res.json((0, service_1.listReports)());
}
