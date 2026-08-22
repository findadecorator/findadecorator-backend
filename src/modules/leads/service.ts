import { listPricingRules } from "@pricing/rules";
import { applyPricingEngine } from "@pricing/engine";
import { getPricingVersion } from "@pricing/versioning";

const leads: Array<any> = [];

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listLeads() {
  return leads;
}

export function createLead(input: {
  customerId: string;
  professionalId: string;
  description: string;
  createdAt?: string;
}) {
  const lead = {
    id: makeId("lead"),
    customerId: input.customerId,
    professionalId: input.professionalId,
    description: input.description,
    createdAt: input.createdAt || new Date().toISOString(),
    status: "live",
    pricing: null
  };

  // Apply pricing engine
  const rules = listPricingRules();
  const version = getPricingVersion();
  lead.pricing = applyPricingEngine(lead, rules, version);

  leads.push(lead);
  return lead;
}

export function updateLeadStatus(leadId: string, status: string) {
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return null;

  lead.status = status;
  return lead;
}

export function listRefunds() {
  return leads
    .filter((lead) => lead.status === "refunded")
    .map((lead) => ({
      id: makeId("refund"),
      leadId: lead.id,
      amount: lead.pricing?.finalPrice || 0,
      status: "pending",
      createdAt: new Date().toISOString()
    }));
}

export function getLeadById(leadId: string) {
  return leads.find((lead) => lead.id === leadId) || null;
}
