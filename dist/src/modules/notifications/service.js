"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = sendNotification;
exports.listNotifications = listNotifications;
exports.updatePreference = updatePreference;
exports.getPreference = getPreference;
const notifications = [];
const preferences = new Map();
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function sendNotification(input) {
    const pref = preferences.get(input.userId) ?? { email: true, in_app: true };
    if ((input.channel === "email" && !pref.email) || (input.channel === "in_app" && !pref.in_app)) {
        return { skipped: true };
    }
    const notification = {
        id: makeId("notif"),
        ...input,
        status: "sent",
        template: `${input.type}.${input.channel}`
    };
    notifications.push(notification);
    return notification;
}
function listNotifications(userId) {
    return userId ? notifications.filter((notification) => notification.userId === userId) : notifications;
}
function updatePreference(input) {
    const current = preferences.get(input.userId) ?? { email: true, in_app: true };
    if (input.channel === "email")
        current.email = input.enabled;
    if (input.channel === "in_app")
        current.in_app = input.enabled;
    preferences.set(input.userId, current);
    return current;
}
function getPreference(userId) {
    return preferences.get(userId) ?? { email: true, in_app: true };
}
