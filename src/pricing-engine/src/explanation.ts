import { PricingRuleVersion } from "./rules";

export interface PricingExplanationInput {
  jobSize: string;
  leadClass: string;
  distanceBand: string;
  complexityBand: string;
  timingBand: string;
  qualityBand: string;
}

export function explainPricing(_rules: PricingRuleVersion, input: PricingExplanationInput, priceGbp: number): string[] {
  return [
    `Lead price generated for ${input.jobSize} job in ${input.distanceBand} area`,
    `Lead class ${input.leadClass} adjusted the quote to £${priceGbp.toFixed(2)}`,
    `Quality ${input.qualityBand} and timing ${input.timingBand} were applied.`
  ];
}
