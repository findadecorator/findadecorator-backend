"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobClassifierSchema = exports.colourAdvisorSchema = exports.quoteAssistantSchema = void 0;
const zod_1 = require("zod");
exports.quoteAssistantSchema = zod_1.z.object({
    jobDescription: zod_1.z.string().min(10),
    projectType: zod_1.z.string().optional()
});
exports.colourAdvisorSchema = zod_1.z.object({
    roomPhotoUrl: zod_1.z.string().optional(),
    roomStyle: zod_1.z.string().optional()
});
exports.jobClassifierSchema = zod_1.z.object({
    jobDescription: zod_1.z.string().min(10)
});
