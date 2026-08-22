"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestQuoteAssistant = suggestQuoteAssistant;
exports.suggestColourAdvisor = suggestColourAdvisor;
exports.classifyJob = classifyJob;
function suggestQuoteAssistant(input) {
    const text = (input.jobDescription ?? "").toLowerCase();
    const labourHours = text.includes("kitchen") ? 12 : text.includes("bathroom") ? 8 : text.includes("hall") ? 6 : 10;
    const materialsCost = text.includes("premium") ? 320 : 220;
    const labourCost = labourHours * 45;
    return {
        quoteSuggestions: {
            labourHours,
            labourCostGbp: labourCost,
            materialsCostGbp: materialsCost,
            totalEstimateGbp: labourCost + materialsCost,
            recommendedProducts: ["Dulux Easycare Matt", "Zinsser Peel Stop", "Toupret Filler"],
            notes: ["Allow 1-2 days for curing and drying between coats.", "Factor in masking and edge detailing for trim work."]
        }
    };
}
function suggestColourAdvisor(input) {
    const palette = input.roomStyle === "modern" ? ["Soft White", "Stone Beige", "Warm Grey"] : ["Sage Green", "Cream", "Pale Blue"];
    return {
        palette,
        finishes: ["matt", "satin"],
        suggestedBrands: ["Dulux", "Farrow & Ball"],
        rationale: "The palette balances natural light and gives a durable low-sheen finish for everyday use."
    };
}
function classifyJob(input) {
    const text = (input.jobDescription ?? "").toLowerCase();
    if (text.includes("villa") || text.includes("large") || text.includes("whole house"))
        return { classification: "large", confidence: 0.92 };
    if (text.includes("kitchen") || text.includes("bathroom") || text.includes("two rooms"))
        return { classification: "medium", confidence: 0.84 };
    return { classification: "small", confidence: 0.78 };
}
