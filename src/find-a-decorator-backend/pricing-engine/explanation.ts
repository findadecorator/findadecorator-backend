import { PricingRuleVersion } from "./rules";

export interface PricingExplanation {
  quote: number;
  basePrice: number;
  distanceFactor: number;
  complexityFactor: number;
  timingFactor: number;
  qualityFactor: number;
  leadClassFactor: number;
  finalMultiplier: number;
  classification: string;
  version: string;
  rationale: string[];
}

export function buildPricingExplanation(
  quote: number,
  basePrice: number,
  factors: {
    distanceFactor: number;
    complexityFactor: number;
    timingFactor: number;
    qualityFactor: number;
    leadClassFactor: number;
  },
  classification: string,
  version: PricingRuleVersion
): PricingExplanation {
  const finalMultiplier =
    factors.distanceFactor *
    factors.complexityFactor *
    factors.timingFactor *
    factors.qualityFactor *
    factors.leadClassFactor;

  return {
    quote,
    basePrice,
    distanceFactor: factors.distanceFactor,
    complexityFactor: factors.complexityFactor,
    timingFactor: factors.timingFactor,
    qualityFactor: factors.qualityFactor,
    leadClassFactor: factors.leadClassFactor,
    finalMultiplier,
    classification,
    version: version.version,
    rationale: [
      `Base price anchored to a ${version.currency} benchmark for the lead type.`,
      `Distance adjustment multiplies the estimate by ${factors.distanceFactor.toFixed(2)}.`,
      `Complexity adjustment multiplies by ${factors.complexityFactor.toFixed(2)}.`,
      `Urgency adjustment multiplies by ${factors.timingFactor.toFixed(2)}.`,
      `Quality and lead classification multiply by ${factors.qualityFactor.toFixed(2)} and ${factors.leadClassFactor.toFixed(2)}.`,
      `Final quote is capped by the configured safety guardrails for deterministic pricing.`
    ]
  };
}
