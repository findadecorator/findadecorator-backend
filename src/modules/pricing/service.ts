import { calculateDeterministicLeadPrice } from "../../../pricing-engine/engine";
import { getActivePricingRuleVersion, listPricingRuleVersions } from "../../../pricing-engine/versioning";

export function calculatePrice(input: {
  jobSize: "small" | "medium" | "large";
  leadClass: "standard" | "premium" | "high-value" | "exclusive";
  distanceBand: "local" | "regional" | "long_distance";
  complexityBand: "low" | "medium" | "high";
  timingBand: "flexible" | "normal" | "urgent";
  qualityBand: "standard" | "premium";
}) {
  return calculateDeterministicLeadPrice(input);
}

export function getRules() {
  return getActivePricingRuleVersion();
}

export function getRuleVersions() {
  return listPricingRuleVersions();
}

