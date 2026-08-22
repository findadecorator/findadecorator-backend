"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckout = createCheckout;
exports.processWebhook = processWebhook;
exports.markCheckoutPaid = markCheckoutPaid;
exports.listInvoices = listInvoices;
exports.getReceiptByInvoiceId = getReceiptByInvoiceId;
exports.generateStatementForProfessional = generateStatementForProfessional;
exports.listStatements = listStatements;
exports.sendReceiptEmail = sendReceiptEmail;
exports.getVatSummary = getVatSummary;
exports.createRefund = createRefund;
exports.listRefunds = listRefunds;
const service_1 = require("../leads/service");
const checkoutByIdempotency = new Map();
const processedWebhookEvents = new Set();
const invoices = [];
const refunds = [];
const receiptEmails = [];
const statements = [];
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function buildReceipt(invoice) {
    return {
        id: `receipt_${invoice.id}`,
        invoiceId: invoice.id,
        totalGbp: invoice.totalGbp,
        subtotalGbp: invoice.subtotalGbp,
        vatGbp: invoice.vatGbp,
        status: "issued",
        qrCode: `https://example.com/receipt/${invoice.id}`,
        downloadUrl: `/api/billing/receipts/${invoice.id}`,
        issuedAt: invoice.createdAt
    };
}
function createCheckout(input) {
    const existing = checkoutByIdempotency.get(input.idempotencyKey);
    if (existing) {
        return existing;
    }
    const preferredMode = input.preferredMode === "advanced" ? "advanced" : "simple";
    const profileType = String(input.profileType ?? "self_employed_decorator");
    const subtotal = Number(input.amountGbp || 0);
    const isAdvanced = preferredMode === "advanced" || profileType === "commercial_customer" || profileType === "registered_company" || Boolean(input.isVatRegistered);
    const vatRate = isAdvanced ? 0.2 : 0;
    const vat = Number((subtotal * vatRate).toFixed(2));
    const invoice = {
        id: makeId("invoice"),
        professionalId: input.professionalId,
        number: `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        subtotalGbp: subtotal,
        totalGbp: Number((subtotal + vat).toFixed(2)),
        vatGbp: vat,
        vatRate,
        status: "unpaid",
        businessName: input.businessName ?? "FIND-A-DECORATOR LTD",
        vatNumber: input.vatNumber ?? (isAdvanced ? "GB000000000" : undefined),
        createdAt: new Date().toISOString(),
        receiptUrl: `/api/billing/receipts/${"invoice"}`,
        downloadablePdf: true,
        invoiceMode: isAdvanced ? "advanced" : "simple",
        profileType,
        preferredMode
    };
    checkoutByIdempotency.set(input.idempotencyKey, {
        checkoutId: makeId("checkout"),
        paymentRef: makeId("pay"),
        status: "pending",
        packKind: input.packKind ?? "payg",
        professionalId: input.professionalId,
        credits: input.credits
    });
    invoices.push(invoice);
    return {
        ...checkoutByIdempotency.get(input.idempotencyKey),
        invoiceId: invoice.id,
        receipt: buildReceipt(invoice),
        vatBreakdown: {
            subtotalGbp: subtotal,
            vatGbp: vat,
            totalGbp: Number((subtotal + vat).toFixed(2)),
            mode: isAdvanced ? "advanced" : "simple"
        }
    };
}
function processWebhook(input) {
    if (processedWebhookEvents.has(input.eventId)) {
        return { idempotent: true, eventId: input.eventId };
    }
    processedWebhookEvents.add(input.eventId);
    return { idempotent: false, ...input };
}
function markCheckoutPaid(paymentRef, professionalId, credits, packKind = "payg") {
    if (packKind === "subscription") {
        (0, service_1.grantSubscriptionCredits)(professionalId, credits, `stripe-subscription:${paymentRef}`);
    }
    else {
        (0, service_1.topUpCredits)(professionalId, credits, `stripe-payment:${paymentRef}`);
    }
    const invoice = invoices.find((inv) => inv.status === "unpaid");
    if (invoice) {
        invoice.status = "paid";
        invoice.receiptUrl = `/api/billing/receipts/${invoice.id}`;
    }
}
function listInvoices(professionalId) {
    return professionalId ? invoices.filter((invoice) => invoice.professionalId === professionalId) : invoices;
}
function getReceiptByInvoiceId(invoiceId) {
    const invoice = invoices.find((item) => item.id === invoiceId);
    if (!invoice)
        return null;
    return {
        ...buildReceipt(invoice),
        customer: {
            businessName: invoice.businessName,
            vatNumber: invoice.vatNumber
        },
        lineItems: [{ description: "Professional credits", amountGbp: invoice.subtotalGbp, vatGbp: invoice.vatGbp }]
    };
}
function generateStatementForProfessional(professionalId, month) {
    const monthInvoices = invoices.filter((invoice) => invoice.professionalId === professionalId && new Date(invoice.createdAt).toISOString().slice(0, 7) === month);
    const subtotal = monthInvoices.reduce((sum, invoice) => sum + invoice.subtotalGbp, 0);
    const vat = monthInvoices.reduce((sum, invoice) => sum + invoice.vatGbp, 0);
    const statement = {
        id: makeId("statement"),
        professionalId,
        month,
        totalGbp: Number((subtotal + vat).toFixed(2)),
        vatGbp: Number(vat.toFixed(2)),
        invoiceCount: monthInvoices.length
    };
    statements.push(statement);
    return statement;
}
function listStatements(professionalId) {
    return professionalId ? statements.filter((statement) => statement.professionalId === professionalId) : statements;
}
function sendReceiptEmail(invoiceId, recipient) {
    const invoice = invoices.find((item) => item.id === invoiceId);
    if (!invoice) {
        return { status: "failed", reason: "invoice-not-found" };
    }
    const email = {
        id: makeId("receipt-email"),
        invoiceId,
        sentAt: new Date().toISOString(),
        recipient,
        status: "sent"
    };
    receiptEmails.push(email);
    return email;
}
function getVatSummary() {
    const totalGross = invoices.reduce((sum, invoice) => sum + invoice.totalGbp, 0);
    const totalVat = invoices.reduce((sum, invoice) => sum + invoice.vatGbp, 0);
    return {
        invoiceCount: invoices.length,
        totalGrossGbp: Number(totalGross.toFixed(2)),
        totalVatGbp: Number(totalVat.toFixed(2)),
        vatRate: 0.2,
        period: "current-quarter"
    };
}
function createRefund(input) {
    const refund = { id: makeId("refund"), ...input, status: "pending" };
    refunds.push(refund);
    return refund;
}
function listRefunds() {
    return refunds;
}
