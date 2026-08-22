"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refundSchema = exports.webhookSchema = exports.checkoutSchema = void 0;
const zod_1 = require("zod");
exports.checkoutSchema = zod_1.z.object({
    professionalId: zod_1.z.string().min(3),
    packName: zod_1.z.string().min(1),
    credits: zod_1.z.number().nonnegative(),
    amountGbp: zod_1.z.number().nonnegative(),
    idempotencyKey: zod_1.z.string().min(8),
    vatNumber: zod_1.z.string().optional(),
    businessName: zod_1.z.string().optional(),
    profileType: zod_1.z.enum(["residential_customer", "commercial_customer", "self_employed_decorator", "registered_company", "admin"]).optional(),
    preferredMode: zod_1.z.enum(["simple", "advanced"]).optional(),
    isVatRegistered: zod_1.z.boolean().optional(),
    packKind: zod_1.z.enum(["payg", "subscription"]).default("payg")
});
exports.webhookSchema = zod_1.z.object({
    eventId: zod_1.z.string().min(5),
    eventType: zod_1.z.string().min(3),
    paymentRef: zod_1.z.string().min(3),
    status: zod_1.z.string().min(3)
});
exports.refundSchema = zod_1.z.object({
    paymentRef: zod_1.z.string().min(3),
    amountGbp: zod_1.z.number().nonnegative(),
    reason: zod_1.z.string().min(3)
});
