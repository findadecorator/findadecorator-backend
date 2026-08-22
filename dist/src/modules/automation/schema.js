"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.automationSchema = void 0;
const zod_1 = require("zod");
exports.automationSchema = zod_1.z.object({
    type: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional()
});
