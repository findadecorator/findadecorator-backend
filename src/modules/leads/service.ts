import { calculateDeterministicLeadPrice, classifyLeadFromAnchor } from "../../../pricing-engine/engine";
import { getActivePricingRuleVersion } from "../../../pricing-engine/versioning";

export interface LeadRecord {
  id: string;
  title: string;
  description: string;
  region: string;
  status: "live" | "matched" | "quoted" | "booked";
  jobSize: "small" | "medium" | "large" | "enterprise";
  leadClass: "standard" | "premium" | "high-value" | "exclusive";
  pricingSnapshot: ReturnType<typeof calculateDeterministicLeadPrice>;
  eligibility: { eligible: boolean; reasons: string[] };
  budgetGbp: number;
  roomSizes: string[];
  surfaces: string[];
  materials: string[];
  timeline: string;
  photos: Array<{ id: string; url: string; blurred: true; exifScrubbed: true }>;
  customerDetails: {
    fullName: string;
    phoneNumber: string;
    email: string;
    fullAddress: string;
    postcode: string;
    businessName?: string;
    landlordName?: string;
    tenantName?: string;
  };
  documents: Array<{ id: string; label: string; downloadUrl: string; exifScrubbed: true }>;
  locationHints: string[];
  metadata: {
    jobCategory: string;
    complexityBand: "low" | "medium" | "high";
    timingBand: "flexible" | "normal" | "urgent";
    qualityBand: "standard" | "premium";
    distanceBand: "local" | "regional" | "long_distance";
  };
  createdAt: string;
}

const leads = new Map<string, LeadRecord>();
const unlocks = new Map<string, { id: string; leadId: string; professionalId: string; priceGbp: number; credits: number; createdAt: string; lead: Record<string, unknown> }>();
const unlockByIdempotencyKey = new Map<string, string>();
const unlockByOwnerLead = new Map<string, string>();
const ledgerEntries: Array<{ id: string; professionalId: string; deltaCredits: number; source: "subscription" | "wallet"; reason: string; createdAt: string }> = [];
const refunds: Array<{ id: string; unlockId: string; reason: string; status: "pending" | "approved" | "rejected"; createdAt: string }> = [];
const subscriptionCreditsByProfessional = new Map<string, number>();
const walletByProfessional = new Map<string, number>();

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function evaluateEligibility(input: { professionalRating: number; valueAnchorGbp: number }) {
  const reasons: string[] = [];
  if (input.professionalRating < 3) reasons.push("professional-rating-too-low");
  if (input.valueAnchorGbp > 6000) reasons.push("manual-review-required");
  return { eligible: reasons.length === 0, reasons };
}

function appendLedger(professionalId: string, deltaCredits: number, reason: string) {
  const next = (walletByProfessional.get(professionalId) ?? 0) + deltaCredits;
  walletByProfessional.set(professionalId, next);
  const entry = { id: makeId("ledger"), professionalId, deltaCredits, source: "wallet" as const, reason, createdAt: new Date().toISOString() };
  ledgerEntries.push(entry);
  return entry;
}

function appendSubscriptionLedger(professionalId: string, deltaCredits: number, reason: string) {
  const next = (subscriptionCreditsByProfessional.get(professionalId) ?? 0) + deltaCredits;
  subscriptionCreditsByProfessional.set(professionalId, next);
  const entry = { id: makeId("ledger"), professionalId, deltaCredits, source: "subscription" as const, reason, createdAt: new Date().toISOString() };
  ledgerEntries.push(entry);
  return entry;
}

export function topUpCredits(professionalId: string, credits: number, reason = "manual-topup") {
  return appendLedger(professionalId, credits, reason);
}

export function grantSubscriptionCredits(professionalId: string, credits: number, reason = "subscription-plan") {
  return appendSubscriptionLedger(professionalId, credits, reason);
}

export function getWallet(professionalId: string) {
  const subscriptionCredits = subscriptionCreditsByProfessional.get(professionalId) ?? 0;
  const walletCredits = walletByProfessional.get(professionalId) ?? 0;
  return {
    professionalId,
    subscriptionCredits,
    walletCredits,
    credits: subscriptionCredits + walletCredits
  };
}

export function listLedger(professionalId?: string) {
  return professionalId ? ledgerEntries.filter((entry) => entry.professionalId === professionalId) : ledgerEntries;
}

function redactLead(lead: LeadRecord) {
  return {
    id: lead.id,
    title: lead.title,
    description: lead.description,
    region: lead.region,
    status: lead.status,
    jobSize: lead.jobSize,
    leadClass: lead.leadClass,
    budgetGbp: lead.budgetGbp,
    roomSizes: lead.roomSizes,
    surfaces: lead.surfaces,
    materials: lead.materials,
    timeline: lead.timeline,
    photos: lead.photos,
    pricingSnapshot: lead.pricingSnapshot,
    eligibility: lead.eligibility,
    createdAt: lead.createdAt,
    hiddenFieldsLocked: true
  };
}

function unlockLeadPayload(lead: LeadRecord) {
  return {
    id: lead.id,
    title: lead.title,
    description: lead.description,
    region: lead.region,
    status: lead.status,
    jobSize: lead.jobSize,
    leadClass: lead.leadClass,
    budgetGbp: lead.budgetGbp,
    roomSizes: lead.roomSizes,
    surfaces: lead.surfaces,
    materials: lead.materials,
    timeline: lead.timeline,
    photos: lead.photos,
    pricingSnapshot: lead.pricingSnapshot,
    eligibility: lead.eligibility,
    customerDetails: lead.customerDetails,
    documents: lead.documents,
    locationHints: lead.locationHints,
    metadata: lead.metadata,
    createdAt: lead.createdAt,
    hiddenFieldsLocked: false,
    messagingEnabled: true,
    quotingEnabled: true,
    bookingEnabled: true,
    mapEnabled: true
  };
}

export function listLeads() {
  return Array.from(leads.values());
}

export function createLead(input: {
  title: string;
  description: string;
  region: string;
  jobSize: "small" | "medium" | "large" | "enterprise";
  complexityBand: "low" | "medium" | "high";
  timingBand: "flexible" | "normal" | "urgent";
  qualityBand: "standard" | "premium";
  distanceBand: "local" | "regional" | "long_distance";
  valueAnchorGbp: number;
  professionalRating: number;
}) {
  const leadClass = classifyLeadFromAnchor(input.valueAnchorGbp);
  const pricingSnapshot = calculateDeterministicLeadPrice({
    jobSize: input.jobSize,
    leadClass,
    complexityBand: input.complexityBand,
    timingBand: input.timingBand,
    qualityBand: input.qualityBand,
    distanceBand: input.distanceBand
  });

  const lead: LeadRecord = {
    id: makeId("lead"),
    title: input.title,
    description: input.description,
    region: input.region,
    status: "live",
    jobSize: input.jobSize,
    leadClass,
    pricingSnapshot: {
      ...pricingSnapshot,
      pricingRuleVersion: getActivePricingRuleVersion().version
    },
    eligibility: evaluateEligibility({ professionalRating: input.professionalRating, valueAnchorGbp: input.valueAnchorGbp }),
    budgetGbp: Number(input.valueAnchorGbp.toFixed(2)),
    roomSizes: ["main room"],
    surfaces: ["walls"],
    materials: ["paint"],
    timeline: "within 2 weeks",
    photos: [{ id: makeId("photo"), url: "/images/lead-photo-scrubbed.jpg", blurred: true, exifScrubbed: true }],
    customerDetails: {
      fullName: "Hidden until unlock",
      phoneNumber: "Hidden until unlock",
      email: "Hidden until unlock",
      fullAddress: "Hidden until unlock",
      postcode: "Hidden until unlock",
      businessName: "Hidden until unlock",
      landlordName: "Hidden until unlock",
      tenantName: "Hidden until unlock"
    },
    documents: [{ id: makeId("doc"), label: "Upload hidden until unlock", downloadUrl: "/api/leads/unlocked-document", exifScrubbed: true }],
    locationHints: ["Hidden until unlock"],
    metadata: {
      jobCategory: "decorating",
      complexityBand: input.complexityBand,
      timingBand: input.timingBand,
      qualityBand: input.qualityBand,
      distanceBand: input.distanceBand
    },
    createdAt: new Date().toISOString()
  };
  leads.set(lead.id, lead);
  return redactLead(lead);
}

export function previewLead(leadId: string, professionalId: string) {
  const lead = leads.get(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }
  return {
    leadId,
    professionalId,
    ...redactLead(lead),
    pricePreview: lead.pricingSnapshot.priceGbp,
    creditsRequired: lead.pricingSnapshot.creditsRequired,
    unlockExplanation: "Customer details remain hidden until credits are deducted.",
    eligibility: lead.eligibility,
    hiddenFieldsLocked: true
  };
}

export function unlockLead(input: { leadId: string; professionalId: string; idempotencyKey: string }) {
  const existingUnlockId = unlockByIdempotencyKey.get(input.idempotencyKey);
  if (existingUnlockId) {
    const existing = unlocks.get(existingUnlockId);
    if (!existing) {
      throw new Error("Idempotency conflict");
    }
    return existing;
  }

  const ownerLeadKey = `${input.professionalId}:${input.leadId}`;
  const existingOwnerUnlockId = unlockByOwnerLead.get(ownerLeadKey);
  if (existingOwnerUnlockId) {
    const existing = unlocks.get(existingOwnerUnlockId);
    if (!existing) {
      throw new Error("Unlock not found");
    }
    return existing;
  }

  const lead = leads.get(input.leadId);
  if (!lead) throw new Error("Lead not found");
  if (!lead.eligibility.eligible) throw new Error(`Lead not eligible: ${lead.eligibility.reasons.join(", ")}`);

  let remaining = lead.pricingSnapshot.creditsRequired;
  const subscriptionCredits = subscriptionCreditsByProfessional.get(input.professionalId) ?? 0;
  const subscriptionDeducted = Math.min(subscriptionCredits, remaining);
  if (subscriptionDeducted > 0) {
    appendSubscriptionLedger(input.professionalId, -subscriptionDeducted, `lead-unlock:${lead.id}`);
    remaining -= subscriptionDeducted;
  }

  if (remaining > 0) {
    const balance = walletByProfessional.get(input.professionalId) ?? 0;
    if (balance < remaining) {
      throw new Error("Insufficient credits");
    }
    appendLedger(input.professionalId, -remaining, `lead-unlock:${lead.id}`);
    remaining = 0;
  }
  const unlock = {
    id: makeId("unlock"),
    leadId: lead.id,
    professionalId: input.professionalId,
    priceGbp: lead.pricingSnapshot.priceGbp,
    credits: lead.pricingSnapshot.creditsRequired,
    createdAt: new Date().toISOString(),
    lead: unlockLeadPayload(lead)
  };
  unlocks.set(unlock.id, unlock);
  unlockByIdempotencyKey.set(input.idempotencyKey, unlock.id);
  unlockByOwnerLead.set(ownerLeadKey, unlock.id);
  return unlock;
}

export function requestRefund(unlockId: string, reason: string) {
  const unlock = unlocks.get(unlockId);
  if (!unlock) throw new Error("Unlock not found");
  const refund = { id: makeId("refund"), unlockId, reason, status: "pending" as const, createdAt: new Date().toISOString() };
  refunds.push(refund);
  return refund;
}

export function listRefunds() {
  return refunds;
}

export function getCreditBalances(professionalId: string) {
  return getWallet(professionalId);
}
