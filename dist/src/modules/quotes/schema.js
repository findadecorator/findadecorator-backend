"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusSchema = exports.createQuoteSchema = void 0;
const zod_1 = require("zod");
exports.createQuoteSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(3),
    professionalId: zod_1.z.string().min(3),
    lines: zod_1.z.array(zod_1.z.object({
        label: zod_1.z.string().min(1),
        amountGbp: zod_1.z.number().nonnegative()
    })).min(1)
});
exports.statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["draft", "sent", "accepted", "declined"])
});
