import { listPricingRules } from "@pricing/rules";
import { applyPricingEngine } from "@pricing/engine";
import { getPricingVersion, listPricingRuleVersions } from "@pricing/versioning";

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
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
