"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivePricingRuleVersion = getActivePricingRuleVersion;
exports.getPricingRuleVersion = getPricingRuleVersion;
exports.listPricingRuleVersions = listPricingRuleVersions;
const rules_1 = require("./rules");
const VERSION_MAP = {
    [rules_1.PRICING_RULES_V1.version]: rules_1.PRICING_RULES_V1
};
function getActivePricingRuleVersion() {
    return rules_1.PRICING_RULES_V1;
}
function getPricingRuleVersion(version) {
    return VERSION_MAP[version] ?? null;
}
function listPricingRuleVersions() {
    return Object.values(VERSION_MAP);
}
