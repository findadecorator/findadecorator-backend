import {
  calculateDeterministicLeadPrice,
  classifyLeadFromAnchor
} from "../../pricing-engine/engine";

import { getActivePricingRuleVersion } from "../../pricing-engine/versioning";

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
  jobSize?: string;
  leadClass?: string;
  distanceBand?: "local" | "regional" | "long_distance";
  complexityBand?: "low" | "medium" | "high";
  timingBand?: "flexible" | "normal" | "urgent";
  qualityBand?: "standard" | "premium";
}) {
  const lead = {
    id: makeId("lead"),
    customerId: input.customerId,
    professionalId: input.professionalId,
    description: input.description,
    createdAt: input.createdAt || new Date().toISOString(),
    status: "live",
    pricingSnapshot: null,
    eligibility: null
  };

  // Apply pricing engine
  const version = getActivePricingRuleVersion();

  lead.pricingSnapshot = calculateDeterministicLeadPrice({
    jobSize: input.jobSize ?? "small",
    leadClass: input.leadClass ?? "standard",
    distanceBand: input.distanceBand ?? "local",
    complexityBand: input.complexityBand ?? "low",
    timingBand: input.timingBand ?? "normal",
    qualityBand: input.qualityBand ?? "standard"
  });

  lead.eligibility = {
    eligible: true,
    reasons: []
  };

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
      amount: lead.pricingSnapshot?.priceGbp || 0,
      status: "pending",
      createdAt: new Date().toISOString()
    }));
}

export function getLeadById(leadId: string) {
  return leads.find((lead) => lead.id === leadId) || null;
}
