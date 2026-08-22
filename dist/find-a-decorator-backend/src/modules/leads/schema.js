"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundSchema = exports.previewSchema = exports.unlockLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
exports.createLeadSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    region: zod_1.z.string().min(1),
    jobSize: zod_1.z.enum(["small", "medium", "large", "enterprise"]).default("small"),
    complexityBand: zod_1.z.enum(["low", "medium", "high"]).default("medium"),
    timingBand: zod_1.z.enum(["flexible", "normal", "urgent"]).default("normal"),
    qualityBand: zod_1.z.enum(["standard", "premium"]).default("standard"),
    distanceBand: zod_1.z.enum(["local", "regional", "long_distance"]).default("local"),
    valueAnchorGbp: zod_1.z.number().nonnegative().default(280),
    professionalRating: zod_1.z.number().default(4.5)
});
exports.unlockLeadSchema = zod_1.z.object({
    leadId: zod_1.z.string().min(3),
    professionalId: zod_1.z.string().min(3),
    idempotencyKey: zod_1.z.string().min(8)
});
exports.previewSchema = zod_1.z.object({
    leadId: zod_1.z.string().min(3),
    professionalId: zod_1.z.string().min(3)
});
exports.refundSchema = zod_1.z.object({
    unlockId: zod_1.z.string().min(3),
    reason: zod_1.z.string().min(5)
});
