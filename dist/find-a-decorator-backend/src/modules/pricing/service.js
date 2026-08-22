"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = calculatePrice;
exports.getRules = getRules;
exports.getRuleVersions = getRuleVersions;
const engine_1 = require("../../../pricing-engine/engine");
const versioning_1 = require("../../../pricing-engine/versioning");
function calculatePrice(input) {
    return (0, engine_1.calculateDeterministicLeadPrice)(input);
}
function getRules() {
    return (0, versioning_1.getActivePricingRuleVersion)();
}
function getRuleVersions() {
    return (0, versioning_1.listPricingRuleVersions)();
}
