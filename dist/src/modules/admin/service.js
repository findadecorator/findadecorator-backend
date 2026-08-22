"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listVerificationQueue = listVerificationQueue;
exports.listModerationQueue = listModerationQueue;
exports.listRefundQueue = listRefundQueue;
exports.listFraudQueue = listFraudQueue;
exports.applyQueueAction = applyQueueAction;
exports.getPricingVersionControl = getPricingVersionControl;
exports.getMarketplaceMetrics = getMarketplaceMetrics;
exports.getCeoOverview = getCeoOverview;
exports.listAuditLogs = listAuditLogs;
const service_1 = require("../reviews/service");
const service_2 = require("../leads/service");
const service_3 = require("../billing/service");
const versioning_1 = require("../../../pricing-engine/versioning");
const verificationQueue = [];
const queueActions = [];
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function listVerificationQueue() {
    if (!verificationQueue.length) {
        verificationQueue.push({ id: makeId("verify"), professionalId: "pro_01", status: "pending" });
    }
    return verificationQueue;
}
function listModerationQueue() {
    return (0, service_1.listReviews)().filter((review) => review.moderationStatus === "pending");
}
function listRefundQueue() {
    return [...(0, service_2.listRefunds)(), ...(0, service_3.listRefunds)()].filter((refund) => refund.status === "pending");
}
function listFraudQueue() {
    return (0, service_1.listReviews)().filter((review) => review.fraudSignals.length > 0);
}
function applyQueueAction(input) {
    const action = { ...input, at: new Date().toISOString() };
    queueActions.push(action);
    return action;
}
function getPricingVersionControl() {
    return (0, versioning_1.listPricingRuleVersions)();
}
function getMarketplaceMetrics() {
    const leads = (0, service_2.listLeads)();
    const reviews = (0, service_1.listReviews)();
    const refundQueue = listRefundQueue();
    const leadsToday = leads.filter((lead) => lead.createdAt && new Date(lead.createdAt).toDateString() === new Date().toDateString()).length;
    const leadsThisWeek = leads.filter((lead) => lead.createdAt && Date.now() - new Date(lead.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length;
    const leadsThisMonth = leads.filter((lead) => lead.createdAt && Date.now() - new Date(lead.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000).length;
    const conversionRate = leads.length ? Number(((leads.filter((lead) => lead.status === "quoted" || lead.status === "booked").length / leads.length) * 100).toFixed(2)) : 0;
    const refundRate = refundQueue.length ? Number(((refundQueue.length / Math.max(1, leads.length)) * 100).toFixed(2)) : 0;
    return {
        totalLeads: leads.length,
        liveLeads: leads.filter((lead) => lead.status === "live").length,
        leadsToday,
        leadsThisWeek,
        leadsThisMonth,
        conversionRate,
        refundRate,
        reviewDistribution: {
            positive: reviews.filter((review) => review.rating >= 4).length,
            mixed: reviews.filter((review) => review.rating >= 3 && review.rating < 4).length,
            negative: reviews.filter((review) => review.rating < 3).length
        },
        pendingRefunds: refundQueue.length,
        openAppeals: (0, service_1.listAppeals)().length,
        invoicesIssued: (0, service_3.listInvoices)().length
    };
}
function getCeoOverview() {
    const metrics = getMarketplaceMetrics();
    return {
        marketplaceHealth: {
            leadsPerDay: metrics.leadsToday,
            leadsPerWeek: metrics.leadsThisWeek,
            leadsPerMonth: metrics.leadsThisMonth,
            conversionRate: metrics.conversionRate,
            refundRate: metrics.refundRate,
            reviewDistribution: metrics.reviewDistribution
        },
        pricingPerformance: {
            revenuePerPaygPack: 94.2,
            subscriptionRevenue: 12560,
            profitPerLead: 286.34,
            guardrailTriggers: 2
        },
        trustAndSafety: {
            fraudFlags: listFraudQueue().length,
            moderationActions: listModerationQueue().length,
            verificationThroughput: listVerificationQueue().length,
            openAppeals: metrics.openAppeals
        }
    };
}
function listAuditLogs() {
    return queueActions.map((action) => ({
        id: makeId("audit"),
        action: `${action.queue}.${action.action}`,
        targetId: action.itemId,
        createdAt: action.at
    }));
}
