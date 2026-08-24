import { PRICING_RULES_V1 } from "../../pricing-engine/src/rules";
import { calculateDeterministicLeadPrice } from "../../pricing-engine/src/engine";
import { getActivePricingRuleVersion, listPricingRuleVersions } from "../../pricing-engine/src/versioning";

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function calculatePrice(input: {
  jobSize?: "small" | "medium" | "large" | "enterprise";
  leadClass?: "standard" | "premium" | "high-value" | "exclusive";
  distanceBand?: "local" | "regional" | "long_distance";
  complexityBand?: "low" | "medium" | "high";
  timingBand?: "flexible" | "normal" | "urgent";
  qualityBand?: "standard" | "premium";
}) {
  return calculateDeterministicLeadPrice({
    jobSize: input.jobSize ?? "small",
    leadClass: input.leadClass ?? "standard",
    distanceBand: input.distanceBand ?? "local",
    complexityBand: input.complexityBand ?? "low",
    timingBand: input.timingBand ?? "normal",
    qualityBand: input.qualityBand ?? "standard"
  });
}

export function getRules() {
  return getActivePricingRuleVersion();
}

export function getRuleVersions() {
  return listPricingRuleVersions();
}

export function listPricingRules() {
  return PRICING_RULES_V1;
}

export function getPricingVersion() {
  return getActivePricingRuleVersion();
}

export function applyPricingEngine(lead: Record<string, unknown>, rules: unknown, version: unknown) {
  const payload = {
    ...lead,
    pricing: typeof rules === "object" && rules !== null ? rules : PRICING_RULES_V1,
    version: version ?? getActivePricingRuleVersion().version,
    createdAt: new Date().toISOString()
  };

  return payload;
}

export function listPricing() {
  const rules = listPricingRules();
  const version = getPricingVersion();

  return {
    version,
    rules
  };
}

export function simulatePricing(input: {
  customerId: string;
  professionalId: string;
  description: string;
}) {
  const lead = {
    id: makeId("lead"),
    customerId: input.customerId,
    professionalId: input.professionalId,
    description: input.description,
    createdAt: new Date().toISOString(),
    status: "simulation"
  };

  const rules = listPricingRules();
  const version = getPricingVersion();

  return applyPricingEngine(lead, rules, version);
}

export function listPricingVersions() {
  return listPricingRuleVersions();
}
