"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusSchema = exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(3),
    quoteId: zod_1.z.string().min(3),
    clientId: zod_1.z.string().min(3),
    professionalId: zod_1.z.string().min(3),
    startDate: zod_1.z.string().min(8)
});
exports.updateStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["created", "confirmed", "in_progress", "completed", "cancelled"])
});
