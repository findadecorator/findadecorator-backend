import { PRICING_RULES_V1 } from "../../pricing-engine/src/rules";
import { calculateDeterministicLeadPrice } from "../../pricing-engine/src/engine";
import { getActivePricingRuleVersion } from "../../pricing-engine/src/versioning";

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listPricingRules() {
  return PRICING_RULES_V1;
}

export function getPricingVersion() {
  return getActivePricingRuleVersion();
}

export function applyPricingEngine(lead: Record<string, unknown>, rules: unknown, version: unknown) {
  const result = {
    ...lead,
    pricing: typeof rules === "object" && rules !== null ? rules : PRICING_RULES_V1,
    version: version ?? getActivePricingRuleVersion().version,
    createdAt: new Date().toISOString()
  };

  return result;
}

export function calculatePaint(input: {
  roomLength: number;
  roomWidth: number;
  roomHeight: number;
  coats: number;
  paintCoverage: number;
  paintType: "matt" | "satin" | "gloss";
}) {
  const wallArea = (input.roomLength * input.roomHeight * 2) + (input.roomWidth * input.roomHeight * 2);
  const litres = Math.max(1, Math.ceil((wallArea * input.coats) / input.paintCoverage));
  const cost = litres * (input.paintType === "matt" ? 18 : input.paintType === "satin" ? 22 : 28);
  const recommendedBrands = ["Dulux Easycare", "Johnstone's Coving White", "Farrow & Ball Estate Emulsion"];
  return { litres, costGbp: Number(cost.toFixed(2)), recommendedBrands, wallArea };
}

export function calculateSurfaceArea(input: {
  length: number;
  width: number;
  height?: number;
}) {
  const area = input.length * input.width * (input.height ?? 1);
  return { areaSqM: Number(area.toFixed(2)), length: input.length, width: input.width, height: input.height ?? 1 };
}

export function calculateWallpaper(input: {
  wallWidth: number;
  wallHeight: number;
  patternRepeat: number;
  wastePercent: number;
  rollWidth: number;
  rollLength: number;
}) {
  const wallArea = input.wallWidth * input.wallHeight;
  const usableLength = input.rollLength - input.patternRepeat;
  const rollsNeeded = Math.max(1, Math.ceil((wallArea / (input.rollWidth * usableLength)) * (1 + input.wastePercent / 100)));
  const cost = rollsNeeded * 24;
  return { rollsNeeded, wasteFactor: Number(((input.wastePercent / 100) * 100).toFixed(1)), costGbp: Number(cost.toFixed(2)), wallArea };
}

export function estimateBudget(input: {
  condition: "good" | "average" | "poor";
  finish: "standard" | "premium";
  rooms: number;
}) {
  const multiplier = input.condition === "good" ? 1.2 : input.condition === "average" ? 1 : 0.8;
  const finishFactor = input.finish === "premium" ? 1.25 : 1;
  const estimate = Math.max(250, input.rooms * 480 * multiplier * finishFactor);
  return { totalBudgetGbp: Number(estimate.toFixed(2)), currency: "GBP", rooms: input.rooms };
}

export function generateQuoteTemplate(input: { rooms: number; customerName?: string; projectType?: string }) {
  return {
    id: makeId("quote"),
    customerName: input.customerName ?? "Client",
    projectType: input.projectType ?? "decorating",
    rooms: input.rooms,
    generatedAt: new Date().toISOString(),
    amountGbp: input.rooms * 675
  };
}

export function getColourGuide() {
  return [
    { name: "Warm White", hex: "#F5F0E6" },
    { name: "Soft Sage", hex: "#B7C8B1" },
    { name: "Dove Grey", hex: "#C8C2BA" }
  ];
}

export function getPrepChecklist() {
  return [
    "Protect flooring and furniture",
    "Wash and repair walls",
    "Mask trims and fixtures",
    "Ventilate the room"
  ];
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
