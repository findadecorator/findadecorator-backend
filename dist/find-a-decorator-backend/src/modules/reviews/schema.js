"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appealSchema = exports.moderationSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(3),
    bookingId: zod_1.z.string().min(3),
    reviewerId: zod_1.z.string().min(3),
    rating: zod_1.z.number(),
    body: zod_1.z.string().min(5)
});
exports.moderationSchema = zod_1.z.object({
    reviewId: zod_1.z.string().min(3),
    action: zod_1.z.enum(["approve", "hide", "flag"])
});
exports.appealSchema = zod_1.z.object({
    reviewId: zod_1.z.string().min(3),
    appellantId: zod_1.z.string().min(3),
    reason: zod_1.z.string().min(3)
});
