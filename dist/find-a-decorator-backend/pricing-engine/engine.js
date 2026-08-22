"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDeterministicLeadPrice = calculateDeterministicLeadPrice;
exports.classifyLeadFromAnchor = classifyLeadFromAnchor;
const explanation_1 = require("./explanation");
const versioning_1 = require("./versioning");
function roundTo2(value) {
    return Math.round(value * 100) / 100;
}
function calculateDeterministicLeadPrice(input) {
    const rules = (0, versioning_1.getActivePricingRuleVersion)();
    const base = rules.leadPricesGbp[input.jobSize];
    const raw = base *
        rules.multipliers.distance[input.distanceBand] *
        rules.multipliers.complexity[input.complexityBand] *
        rules.multipliers.timing[input.timingBand] *
        rules.multipliers.quality[input.qualityBand] *
        rules.multipliers.leadClass[input.leadClass];
    const bounded = Math.max(rules.guardrails.minLeadPriceGbp, Math.min(rules.guardrails.maxLeadPriceGbp, roundTo2(raw)));
    const explanationInput = {
        jobSize: input.jobSize,
        leadClass: input.leadClass,
        distanceBand: input.distanceBand,
        complexityBand: input.complexityBand,
        timingBand: input.timingBand,
        qualityBand: input.qualityBand
    };
    return {
        priceGbp: bounded,
        creditsRequired: rules.creditsPerJob[input.jobSize],
        jobValueAnchorGbp: rules.jobValueAnchorsGbp[input.jobSize],
        pricingRuleVersion: rules.version,
        netProfitPerLeadGbp: rules.permanentEconomics.netProfitPerLeadGbp,
        paymentFeeModel: rules.permanentEconomics.paymentFeeModel,
        explanation: (0, explanation_1.explainPricing)(rules, explanationInput, bounded)
    };
}
function classifyLeadFromAnchor(valueGbp) {
    if (valueGbp >= 4000) {
        return "high-value";
    }
    if (valueGbp >= 1000) {
        return "premium";
    }
    return "standard";
}
