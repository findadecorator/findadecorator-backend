import { listPricingRules } from "../../pricing-engine/rules";
import { applyPricingEngine } from "../../pricing-engine/engine";
import { getPricingVersion } from "../../pricing-engine/versioning";

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listTools() {
  return [
    { id: makeId("tool"), name: "Pricing Simulator", category: "pricing" },
    { id: makeId("tool"), name: "Lead Generator", category: "leads" },
    { id: makeId("tool"), name: "Refund Calculator", category: "billing" }
  ];
}

export function simulateToolPricing(input: {
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
    status: "tool-simulation"
  };

  const rules = listPricingRules();
  const version = getPricingVersion();

  return applyPricingEngine(lead, rules, version);
}
