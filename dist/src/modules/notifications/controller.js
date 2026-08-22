"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationController = sendNotificationController;
exports.listNotificationsController = listNotificationsController;
exports.updatePreferenceController = updatePreferenceController;
exports.getPreferenceController = getPreferenceController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function sendNotificationController(req, res) {
    const parsed = schema_1.sendNotificationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.sendNotification)(parsed.data));
}
function listNotificationsController(req, res) {
    const userId = req.query.userId ? String(req.query.userId) : undefined;
    res.json((0, service_1.listNotifications)(userId));
}
function updatePreferenceController(req, res) {
    const parsed = schema_1.preferenceSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.json((0, service_1.updatePreference)(parsed.data));
}
function getPreferenceController(req, res) {
    const userId = String(req.query.userId ?? "");
    if (!userId) {
        res.status(400).json({ error: "userId query is required" });
        return;
    }
    res.json((0, service_1.getPreference)(userId));
}
