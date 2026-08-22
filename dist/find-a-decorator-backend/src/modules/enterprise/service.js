"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnterprisePlan = getEnterprisePlan;
function getEnterprisePlan() {
    return {
        tier: "Platinum",
        features: [
            "Team accounts",
            "Role permissions",
            "Multi-region management",
            "API access",
            "Bulk lead bundles",
            "SLA routing",
            "Dedicated account manager"
        ],
        includedRegions: "Unlimited",
        sla: "99.9%",
        support: "Priority account management"
    };
}
