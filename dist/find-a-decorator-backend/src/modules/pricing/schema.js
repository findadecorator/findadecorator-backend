"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingInputSchema = void 0;
const zod_1 = require("zod");
exports.pricingInputSchema = zod_1.z.object({
    jobSize: zod_1.z.enum(["small", "medium", "large", "enterprise"]),
    leadClass: zod_1.z.enum(["standard", "premium", "high-value", "exclusive"]).default("standard"),
    distanceBand: zod_1.z.enum(["local", "regional", "long_distance"]).default("local"),
    complexityBand: zod_1.z.enum(["low", "medium", "high"]).default("medium"),
    timingBand: zod_1.z.enum(["flexible", "normal", "urgent"]).default("normal"),
    qualityBand: zod_1.z.enum(["standard", "premium"]).default("standard")
});
