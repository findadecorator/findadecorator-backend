"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = exports.blockSchema = exports.readReceiptSchema = exports.sendMessageSchema = exports.createConversationSchema = void 0;
const zod_1 = require("zod");
exports.createConversationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    participantIds: zod_1.z.array(zod_1.z.string().min(1)).min(2),
    jobId: zod_1.z.string().optional()
});
exports.sendMessageSchema = zod_1.z.object({
    body: zod_1.z.string().min(1),
    senderId: zod_1.z.string().min(1),
    attachmentIds: zod_1.z.array(zod_1.z.string()).optional()
});
exports.readReceiptSchema = zod_1.z.object({
    messageId: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1)
});
exports.blockSchema = zod_1.z.object({
    blockerId: zod_1.z.string().min(1),
    blockedId: zod_1.z.string().min(1),
    reason: zod_1.z.string().min(3)
});
exports.reportSchema = zod_1.z.object({
    authorId: zod_1.z.string().min(1),
    subjectId: zod_1.z.string().min(1),
    reason: zod_1.z.string().min(3)
});
