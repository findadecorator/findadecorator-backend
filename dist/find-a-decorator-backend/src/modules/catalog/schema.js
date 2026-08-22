"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productQuerySchema = void 0;
const zod_1 = require("zod");
exports.productQuerySchema = zod_1.z.object({
    category: zod_1.z.string().optional(),
    jobType: zod_1.z.string().optional()
});
