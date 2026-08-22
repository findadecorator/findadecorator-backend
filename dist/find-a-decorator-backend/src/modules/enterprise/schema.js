"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enterpriseSchema = void 0;
const zod_1 = require("zod");
exports.enterpriseSchema = zod_1.z.object({
    companyId: zod_1.z.string().optional(),
    region: zod_1.z.string().optional()
});
