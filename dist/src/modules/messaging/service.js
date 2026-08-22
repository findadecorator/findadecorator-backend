"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConversations = listConversations;
exports.createConversation = createConversation;
exports.listMessages = listMessages;
exports.sendMessage = sendMessage;
exports.markRead = markRead;
exports.addBlock = addBlock;
exports.addReport = addReport;
exports.listReports = listReports;
const realtime_1 = require("../../lib/realtime");
const conversations = new Map();
const messages = new Map();
const receipts = new Map();
const blocks = new Map();
const reports = [];
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function listConversations(userId) {
    return Array.from(conversations.values())
        .filter((conversation) => !userId || conversation.participantIds.includes(userId))
        .map((conversation) => {
        const thread = messages.get(conversation.id) ?? [];
        const last = thread[thread.length - 1];
        return {
            id: conversation.id,
            title: conversation.title,
            unread: false,
            lastMessageBody: last?.body ?? "",
            lastMessageAt: last?.createdAt ?? conversation.updatedAt
        };
    });
}
function createConversation(input) {
    const now = new Date().toISOString();
    const conversation = {
        id: makeId("conv"),
        title: input.title,
        participantIds: input.participantIds,
        jobId: input.jobId,
        createdAt: now,
        updatedAt: now
    };
    conversations.set(conversation.id, conversation);
    messages.set(conversation.id, []);
    return conversation;
}
function listMessages(conversationId) {
    return messages.get(conversationId) ?? [];
}
function sendMessage(conversationId, input) {
    const conversation = conversations.get(conversationId);
    if (!conversation) {
        throw new Error("Conversation not found");
    }
    const blocked = blocks.get(`${input.senderId}:${conversationId}`);
    if (blocked) {
        throw new Error("Messaging blocked in this thread");
    }
    const message = {
        id: makeId("msg"),
        conversationId,
        senderId: input.senderId,
        body: input.body,
        attachmentIds: input.attachmentIds,
        createdAt: new Date().toISOString()
    };
    const current = messages.get(conversationId) ?? [];
    current.push(message);
    messages.set(conversationId, current);
    conversations.set(conversationId, { ...conversation, updatedAt: message.createdAt });
    (0, realtime_1.emitEvent)(`conversation:${conversationId}`, "message:new", message);
    (0, realtime_1.emitEvent)(`conversation:${conversationId}`, "conversation:update", {
        conversationId,
        lastMessageBody: message.body,
        lastMessageAt: message.createdAt
    });
    return message;
}
function markRead(messageId, userId) {
    const set = receipts.get(messageId) ?? new Set();
    set.add(userId);
    receipts.set(messageId, set);
    return { messageId, userId, readAt: new Date().toISOString() };
}
function addBlock(input) {
    blocks.set(`${input.blockerId}:${input.blockedId}`, input);
    return input;
}
function addReport(input) {
    const report = { id: makeId("report"), ...input, createdAt: new Date().toISOString() };
    reports.push(report);
    return report;
}
function listReports() {
    return reports;
}
