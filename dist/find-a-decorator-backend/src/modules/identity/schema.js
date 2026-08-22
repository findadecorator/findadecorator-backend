"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = exports.profileTypes = void 0;
const zod_1 = require("zod");
exports.profileTypes = [
    "residential_customer",
    "commercial_customer",
    "self_employed_decorator",
    "registered_company",
    "admin"
];
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    name: zod_1.z.string().min(1).optional(),
    role: zod_1.z.enum(["guest", "client", "professional", "verifier", "support", "admin"]).default("client"),
    profileType: zod_1.z.enum(exports.profileTypes).default("residential_customer"),
    businessName: zod_1.z.string().optional(),
    companyNumber: zod_1.z.string().optional(),
    vatNumber: zod_1.z.string().optional(),
    isVatRegistered: zod_1.z.boolean().default(false),
    businessType: zod_1.z.string().optional(),
    regionsCovered: zod_1.z.array(zod_1.z.string()).default([]),
    servicesOffered: zod_1.z.array(zod_1.z.string()).default([]),
    insuranceDetails: zod_1.z.string().optional(),
    portfolioLinks: zod_1.z.array(zod_1.z.string()).default([]),
    teamSize: zod_1.z.number().optional(),
    preferredMode: zod_1.z.enum(["simple", "advanced"]).default("simple")
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string().min(8),
    newPassword: zod_1.z.string().min(8)
});
exports.verifyEmailSchema = zod_1.z.object({
    token: zod_1.z.string().min(8)
});
