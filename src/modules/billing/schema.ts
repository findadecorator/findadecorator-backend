import { z } from "zod";

export const checkoutSchema = z.object({
  professionalId: z.string().min(3),
  packName: z.string().min(1),
  credits: z.number().nonnegative(),
  amountGbp: z.number().nonnegative(),
  idempotencyKey: z.string().min(8),
  vatNumber: z.string().optional(),
  businessName: z.string().optional(),
  profileType: z.enum(["residential_customer", "commercial_customer", "self_employed_decorator", "registered_company", "admin"]).optional(),
  preferredMode: z.enum(["simple", "advanced"]).optional(),
  isVatRegistered: z.boolean().optional(),
  packKind: z.enum(["payg", "subscription"]).default("payg")
});

export const webhookSchema = z.object({
  eventId: z.string().min(5),
  eventType: z.string().min(3),
  paymentRef: z.string().min(3),
  status: z.string().min(3)
});

export const refundSchema = z.object({
  paymentRef: z.string().min(3),
  amountGbp: z.number().nonnegative(),
  reason: z.string().min(3)
});
