"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainPricing = explainPricing;
function explainPricing(rules, input, finalPriceGbp) {
    const lines = [];
    lines.push(`Pricing rules version: ${rules.version}`);
    lines.push(`Base lead price (${input.jobSize}): £${rules.leadPricesGbp[input.jobSize].toFixed(2)}`);
    lines.push(`Unlock credits required (${input.jobSize}): ${rules.creditsPerJob[input.jobSize]}`);
    lines.push(`Credit value: £${rules.creditValueGbp.toFixed(2)} ex-VAT`);
    lines.push(`Distance multiplier (${input.distanceBand}): x${rules.multipliers.distance[input.distanceBand]}`);
    lines.push(`Complexity multiplier (${input.complexityBand}): x${rules.multipliers.complexity[input.complexityBand]}`);
    lines.push(`Timing multiplier (${input.timingBand}): x${rules.multipliers.timing[input.timingBand]}`);
    lines.push(`Quality multiplier (${input.qualityBand}): x${rules.multipliers.quality[input.qualityBand]}`);
    lines.push(`Lead classification multiplier (${input.leadClass}): x${rules.multipliers.leadClass[input.leadClass]}`);
    lines.push(`Guardrails applied: min £${rules.guardrails.minLeadPriceGbp.toFixed(2)} max £${rules.guardrails.maxLeadPriceGbp.toFixed(2)}`);
    lines.push(`Final deterministic lead price: £${finalPriceGbp.toFixed(2)}`);
    return lines;
}
