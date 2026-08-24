import {
  calculateDeterministicLeadPrice,
  classifyLeadFromAnchor
} from "../../pricing-engine/src/engine";

import { getActivePricingRuleVersion } from "../../pricing-engine/src/versioning";

const leads: Array<any> = [];
const creditLedger = new Map<string, number>();
const unlocks: Array<any> = [];

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listLeads() {
  return leads;
}

export function getCreditBalances(professionalId: string) {
  return {
    professionalId,
    availableCredits: creditLedger.get(professionalId) ?? 0,
    currency: "GBP"
  };
}

export function topUpCredits(professionalId: string, credits: number, source: string) {
  const balance = creditLedger.get(professionalId) ?? 0;
  const nextBalance = balance + credits;
  creditLedger.set(professionalId, nextBalance);
  return {
    professionalId,
    addedCredits: credits,
    balance: nextBalance,
    source,
    updatedAt: new Date().toISOString()
  };
}

export function grantSubscriptionCredits(professionalId: string, credits: number, source: string) {
  return topUpCredits(professionalId, credits, source);
}

export function listLedger(professionalId?: string) {
  if (!professionalId) {
    return Array.from(creditLedger.entries()).map(([id, credits]) => ({ professionalId: id, credits }));
  }
  return [{ professionalId, credits: creditLedger.get(professionalId) ?? 0 }];
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
  const lead: any = {
    id: makeId("lead"),
    customerId: input.customerId,
    professionalId: input.professionalId,
    description: input.description,
    createdAt: input.createdAt || new Date().toISOString(),
    status: "live",
    pricingSnapshot: null,
    eligibility: null
  };

  const version = getActivePricingRuleVersion();

  lead.pricingSnapshot = calculateDeterministicLeadPrice({
    jobSize: (input.jobSize ?? "small") as any,
    leadClass: (input.leadClass ?? "standard") as any,
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

export function previewLead(leadId: string, professionalId: string) {
  const lead = leads.find((candidate) => candidate.id === leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }
  return {
    leadId: lead.id,
    professionalId,
    title: lead.description,
    price: lead.pricingSnapshot?.priceGbp ?? 0,
    eligible: lead.eligibility?.eligible ?? true,
    classification: classifyLeadFromAnchor(lead.pricingSnapshot?.jobValueAnchorGbp ?? 0)
  };
}

export function unlockLead(input: { leadId: string; professionalId: string; credits?: number }) {
  const lead = leads.find((candidate) => candidate.id === input.leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const creditsNeeded = Math.max(1, Number(input.credits ?? 1));
  const balance = creditLedger.get(input.professionalId) ?? 0;
  if (balance < creditsNeeded) {
    throw new Error("Insufficient credits");
  }

  creditLedger.set(input.professionalId, balance - creditsNeeded);
  const unlock = {
    id: makeId("unlock"),
    leadId: input.leadId,
    professionalId: input.professionalId,
    creditsUsed: creditsNeeded,
    status: "unlocked",
    createdAt: new Date().toISOString()
  };
  unlocks.push(unlock);
  return unlock;
}

export function requestRefund(unlockId: string, reason: string) {
  const unlock = unlocks.find((entry) => entry.id === unlockId);
  if (!unlock) {
    throw new Error("Unlock not found");
  }
  const refund = {
    id: makeId("refund"),
    unlockId,
    reason,
    amountGbp: unlock.creditsUsed * 10,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  return refund;
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
