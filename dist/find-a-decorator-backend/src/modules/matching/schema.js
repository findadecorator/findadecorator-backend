"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMatchSchema = void 0;
const zod_1 = require("zod");
exports.runMatchSchema = zod_1.z.object({
    jobId: zod_1.z.string().min(3),
    region: zod_1.z.string().min(1),
    serviceType: zod_1.z.string().min(1).default("painting")
});
