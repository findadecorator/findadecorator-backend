import { listAppeals, listReviews } from "../reviews/service";
import { listRefunds as listLeadRefunds, listLeads } from "../leads/service";
import { listRefunds as listBillingRefunds, listInvoices } from "../billing/service";
import { listPricingRuleVersions } from "../../pricing-engine/src/versioning";

const verificationQueue: Array<{ id: string; professionalId: string; status: string }> = [];
const queueActions: Array<{ queue: string; itemId: string; action: string; at: string }> = [];

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listVerificationQueue() {
  if (!verificationQueue.length) {
    verificationQueue.push({
      id: makeId("verify"),
      professionalId: "pro_01",
      status: "pending"
    });
  }
  return verificationQueue;
}

export function listModerationQueue() {
  return listReviews().filter((review) => review.moderationStatus === "pending");
}

export function listRefundQueue() {
  return [...listLeadRefunds(), ...listBillingRefunds()].filter(
    (refund: any) => refund.status === "pending"
  );
}

export function listFraudQueue() {
  return listReviews().filter((review) => review.fraudSignals.length > 0);
}

export function applyQueueAction(input: { queue: string; itemId: string; action: string }) {
  const action = { ...input, at: new Date().toISOString() };
  queueActions.push(action);
  return action;
}

export function getPricingVersionControl() {
  return listPricingRuleVersions();
}

export function getMarketplaceMetrics() {
  const leads = listLeads();
  const reviews = listReviews();
  const refundQueue = listRefundQueue();

  const leadsToday = leads.filter(
    (lead) =>
      lead.createdAt &&
      new Date(lead.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const leadsThisWeek = leads.filter(
    (lead) =>
      lead.createdAt &&
      Date.now() - new Date(lead.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ).length;

  const leadsThisMonth = leads.filter(
    (lead) =>
      lead.createdAt &&
      Date.now() - new Date(lead.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
  ).length;

  const conversionRate = leads.length
    ? Number(
        (
          (leads.filter((lead) => lead.status === "quoted" || lead.status === "booked").length /
            leads.length) *
          100
        ).toFixed(2)
      )
    : 0;

  const refundRate = refundQueue.length
    ? Number(((refundQueue.length / Math.max(1, leads.length)) * 100).toFixed(2))
    : 0;

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
    openAppeals: listAppeals().length,
    invoicesIssued: listInvoices().length
  };
}

export function getCeoOverview() {
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

export function listAuditLogs() {
  return queueActions.map((action) => ({
    id: makeId("audit"),
    action: `${action.queue}.${action.action}`,
    targetId: action.itemId,
    createdAt: action.at
  }));
}
