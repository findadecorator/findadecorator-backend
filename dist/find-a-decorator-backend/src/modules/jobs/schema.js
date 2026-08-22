"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSchema = exports.jobStatusSchema = void 0;
const zod_1 = require("zod");
exports.jobStatusSchema = zod_1.z.enum([
    "draft",
    "submitted",
    "review",
    "live",
    "matched",
    "quoted",
    "booked",
    "completed",
    "cancelled",
    "archived"
]);
exports.createJobSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    postcode: zod_1.z.string().min(3),
    serviceType: zod_1.z.string().min(1).default("painting"),
    jobSize: zod_1.z.enum(["small", "medium", "large", "enterprise"]).default("small")
});
