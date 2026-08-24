export type LeadClass = "standard" | "premium" | "high-value" | "exclusive";
export type JobSize = "small" | "medium" | "large" | "enterprise";

export interface PricingRuleVersion {
  version: string;
  effectiveFrom: string;
  currency: "GBP";
  creditValueGbp: number;
  paygPacks: Array<{ name: string; credits: number; priceGbp: number }>;
  subscriptionTiers: Array<{ name: string; credits: number; regions: string; profitGbp: number }>;
  leadPricesGbp: Record<JobSize, number>;
  jobValueAnchorsGbp: Record<JobSize, number>;
  creditsPerJob: Record<JobSize, number>;
  commissionPct: Record<JobSize, number>;
  guardrails: { minLeadPriceGbp: number; maxLeadPriceGbp: number };
  multipliers: {
    distance: Record<"local" | "regional" | "long_distance", number>;
    complexity: Record<"low" | "medium" | "high", number>;
    timing: Record<"flexible" | "normal" | "urgent", number>;
    quality: Record<"standard" | "premium", number>;
    leadClass: Record<LeadClass, number>;
  };
  safeControls: {
    noAuctions: true;
    noSurgePricing: true;
    noAutoRenewalSubscriptions: true;
    noCommissionsOnJobValueUntilLegalReview: true;
    noExclusiveLeadsUntilSafetyReviewed: true;
  };
  permanentEconomics: {
    weightedAverageProfitGbp: number;
    paymentFeeModel: string;
    netProfitPerLeadGbp: number;
    exclusiveMultiplier: number;
  };
}

export const PRICING_RULES_V1: PricingRuleVersion = {
  version: "2026-08-15.v1",
  effectiveFrom: "2026-08-15T00:00:00.000Z",
  currency: "GBP",
  creditValueGbp: 4.9,
  paygPacks: [
    { name: "Small-1", credits: 6, priceGbp: 29.4 },
    { name: "Medium-1", credits: 20, priceGbp: 98 },
    { name: "Pro-Medium", credits: 20, priceGbp: 98 },
    { name: "Mini", credits: 12, priceGbp: 58.8 },
    { name: "Small", credits: 30, priceGbp: 147 },
    { name: "Medium", credits: 60, priceGbp: 294 },
    { name: "Large", credits: 100, priceGbp: 490 },
    { name: "Pro Bulk", credits: 200, priceGbp: 980 },
    { name: "Platinum Bulk", credits: 400, priceGbp: 1960 }
  ],
  subscriptionTiers: [
    { name: "Starter", credits: 0, regions: "1 region", profitGbp: 1142.36 },
    { name: "Pro", credits: 30, regions: "1 region", profitGbp: 1450.7 },
    { name: "Growth", credits: 100, regions: "2 regions", profitGbp: 1770.04 },
    { name: "Premium", credits: 200, regions: "5 regions", profitGbp: 2980.4 },
    { name: "Platinum", credits: 400, regions: "unlimited regions", profitGbp: 4294.5 }
  ],
  leadPricesGbp: {
    small: 56,
    medium: 250,
    large: 1200,
    enterprise: 2500
  },
  jobValueAnchorsGbp: {
    small: 280,
    medium: 1000,
    large: 4000,
    enterprise: 8000
  },
  creditsPerJob: {
    small: 1,
    medium: 2,
    large: 3,
    enterprise: 4
  },
  commissionPct: {
    small: 20,
    medium: 25,
    large: 30,
    enterprise: 35
  },
  guardrails: {
    minLeadPriceGbp: 30,
    maxLeadPriceGbp: 1500
  },
  multipliers: {
    distance: {
      local: 1,
      regional: 1.15,
      long_distance: 1.3
    },
    complexity: {
      low: 0.9,
      medium: 1,
      high: 1.2
    },
    timing: {
      flexible: 0.95,
      normal: 1,
      urgent: 1.15
    },
    quality: {
      standard: 1,
      premium: 1.1
    },
    leadClass: {
      standard: 1,
      premium: 1.2,
      "high-value": 1.35,
      exclusive: 1.8
    }
  },
  safeControls: {
    noAuctions: true,
    noSurgePricing: true,
    noAutoRenewalSubscriptions: true,
    noCommissionsOnJobValueUntilLegalReview: true,
    noExclusiveLeadsUntilSafetyReviewed: true
  },
  permanentEconomics: {
    weightedAverageProfitGbp: 295.5,
    paymentFeeModel: "2.9% + £0.30",
    netProfitPerLeadGbp: 286.34,
    exclusiveMultiplier: 1.8
  }
};
