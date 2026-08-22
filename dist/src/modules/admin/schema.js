"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueActionSchema = void 0;
const zod_1 = require("zod");
exports.queueActionSchema = zod_1.z.object({
    queue: zod_1.z.enum(["verification", "moderation", "refund", "fraud"]),
    itemId: zod_1.z.string().min(3),
    action: zod_1.z.enum(["approve", "reject", "escalate"])
});
