import { PRICING_RULES_V1, LeadClass, JobSize, PricingRuleVersion } from "./rules";
import { buildPricingExplanation } from "./explanation";

export type LeadClassification =
  | "standard"
  | "premium"
  | "high-value"
  | "exclusive";

export interface LeadPricingInput {
  jobSize: JobSize;
  distanceBand?: "local" | "regional" | "long_distance";
  complexity?: "low" | "medium" | "high";
  timing?: "flexible" | "normal" | "urgent";
  quality?: "standard" | "premium";
  leadClass?: LeadClass;
  anchorValueGbp?: number;
  priority?: number;
}

export interface LeadPriceResult {
  quoteGbp: number;
  basePriceGbp: number;
  classification: LeadClassification;
  explanation: ReturnType<typeof buildPricingExplanation>;
  version: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function classifyLeadFromAnchor(anchorValueGbp: number): LeadClassification {
  if (anchorValueGbp >= 8500) return "exclusive";
  if (anchorValueGbp >= 3500) return "high-value";
  if (anchorValueGbp >= 1200) return "premium";
  return "standard";
}

export function calculateDeterministicLeadPrice(
  input: LeadPricingInput,
  version: PricingRuleVersion = PRICING_RULES_V1
): LeadPriceResult {
  const jobSize = input.jobSize ?? "medium";
  const distanceBand = input.distanceBand ?? "local";
  const complexity = input.complexity ?? "medium";
  const timing = input.timing ?? "normal";
  const quality = input.quality ?? "standard";
  const leadClass = input.leadClass ?? classifyLeadFromAnchor(input.anchorValueGbp ?? version.jobValueAnchorsGbp[jobSize]);

  const basePrice = version.leadPricesGbp[jobSize] ?? version.leadPricesGbp.medium;
  const anchorValue = input.anchorValueGbp ?? version.jobValueAnchorsGbp[jobSize] ?? basePrice;
  const leadScore = classifyLeadFromAnchor(anchorValue);

  const distanceFactor = version.multipliers.distance[distanceBand] ?? 1;
  const complexityFactor = version.multipliers.complexity[complexity] ?? 1;
  const timingFactor = version.multipliers.timing[timing] ?? 1;
  const qualityFactor = version.multipliers.quality[quality] ?? 1;
  const leadClassFactor = version.multipliers.leadClass[leadClass] ?? 1;

  const multiplier =
    distanceFactor * complexityFactor * timingFactor * qualityFactor * leadClassFactor;

  const unboundedPrice = basePrice * multiplier * (1 + Math.max(0, (anchorValue - basePrice) / 1000) * 0.12);
  const safePrice = clamp(unboundedPrice, version.guardrails.minLeadPriceGbp, version.guardrails.maxLeadPriceGbp);

  const explanation = buildPricingExplanation(
    Number(safePrice.toFixed(2)),
    Number(basePrice.toFixed(2)),
    { distanceFactor, complexityFactor, timingFactor, qualityFactor, leadClassFactor },
    leadScore,
    version
  );

  return {
    quoteGbp: Number(safePrice.toFixed(2)),
    basePriceGbp: Number(basePrice.toFixed(2)),
    classification: leadScore,
    explanation,
    version: version.version
  };
}

export function estimateLeadPriceFromJobValue(
  anchorValueGbp: number,
  overrides: Partial<LeadPricingInput> = {},
  version: PricingRuleVersion = PRICING_RULES_V1
): LeadPriceResult {
  const jobSize = overrides.jobSize ?? "medium";
  return calculateDeterministicLeadPrice(
    {
      ...overrides,
      jobSize,
      anchorValueGbp,
      leadClass: overrides.leadClass ?? classifyLeadFromAnchor(anchorValueGbp)
    },
    version
  );
}
