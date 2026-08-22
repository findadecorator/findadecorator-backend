"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferenceSchema = exports.sendNotificationSchema = void 0;
const zod_1 = require("zod");
exports.sendNotificationSchema = zod_1.z.object({
    userId: zod_1.z.string().min(3),
    type: zod_1.z.string().min(2),
    channel: zod_1.z.enum(["email", "in_app"]),
    payload: zod_1.z.record(zod_1.z.any())
});
exports.preferenceSchema = zod_1.z.object({
    userId: zod_1.z.string().min(3),
    channel: zod_1.z.enum(["email", "in_app"]),
    enabled: zod_1.z.boolean()
});
