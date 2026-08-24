import { explainPricing, PricingExplanationInput } from "./explanation";
import { JobSize, LeadClass } from "./rules";
import { getActivePricingRuleVersion } from "./versioning";

export interface DeterministicPricingInput {
  jobSize: JobSize;
  leadClass: LeadClass;
  distanceBand: "local" | "regional" | "long_distance";
  complexityBand: "low" | "medium" | "high";
  timingBand: "flexible" | "normal" | "urgent";
  qualityBand: "standard" | "premium";
}

export interface DeterministicPricingResult {
  priceGbp: number;
  creditsRequired: number;
  jobValueAnchorGbp: number;
  pricingRuleVersion: string;
  netProfitPerLeadGbp: number;
  paymentFeeModel: string;
  explanation: string[];
}

function roundTo2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateDeterministicLeadPrice(input: DeterministicPricingInput): DeterministicPricingResult {
  const rules = getActivePricingRuleVersion();
  const base = rules.leadPricesGbp[input.jobSize];
  const raw =
    base *
    rules.multipliers.distance[input.distanceBand] *
    rules.multipliers.complexity[input.complexityBand] *
    rules.multipliers.timing[input.timingBand] *
    rules.multipliers.quality[input.qualityBand] *
    rules.multipliers.leadClass[input.leadClass];

  const bounded = Math.max(rules.guardrails.minLeadPriceGbp, Math.min(rules.guardrails.maxLeadPriceGbp, roundTo2(raw)));

  const explanationInput: PricingExplanationInput = {
    jobSize: input.jobSize,
    leadClass: input.leadClass,
    distanceBand: input.distanceBand,
    complexityBand: input.complexityBand,
    timingBand: input.timingBand,
    qualityBand: input.qualityBand
  };

  return {
    priceGbp: bounded,
    creditsRequired: rules.creditsPerJob[input.jobSize],
    jobValueAnchorGbp: rules.jobValueAnchorsGbp[input.jobSize],
    pricingRuleVersion: rules.version,
    netProfitPerLeadGbp: rules.permanentEconomics.netProfitPerLeadGbp,
    paymentFeeModel: rules.permanentEconomics.paymentFeeModel,
    explanation: explainPricing(rules, explanationInput, bounded)
  };
}

export function classifyLeadFromAnchor(valueGbp: number): LeadClass {
  if (valueGbp >= 4000) {
    return "high-value";
  }
  if (valueGbp >= 1000) {
    return "premium";
  }
  return "standard";
}
