import { z } from "zod";

export const profileTypes = [
  "residential_customer",
  "commercial_customer",
  "self_employed_decorator",
  "registered_company",
  "admin"
] as const;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  role: z.enum(["guest", "client", "professional", "verifier", "support", "admin"]).default("client"),
  profileType: z.enum(profileTypes).default("residential_customer"),
  businessName: z.string().optional(),
  companyNumber: z.string().optional(),
  vatNumber: z.string().optional(),
  isVatRegistered: z.boolean().default(false),
  businessType: z.string().optional(),
  regionsCovered: z.array(z.string()).default([]),
  servicesOffered: z.array(z.string()).default([]),
  insuranceDetails: z.string().optional(),
  portfolioLinks: z.array(z.string()).default([]),
  teamSize: z.number().optional(),
  preferredMode: z.enum(["simple", "advanced"]).default("simple")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  token: z.string().min(8),
  newPassword: z.string().min(8)
});

export const verifyEmailSchema = z.object({
  token: z.string().min(8)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

