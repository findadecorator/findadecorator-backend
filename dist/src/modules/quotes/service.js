"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuotes = listQuotes;
exports.createQuote = createQuote;
exports.updateQuoteStatus = updateQuoteStatus;
const quotes = [];
function makeId() {
    return `quote_${Math.random().toString(36).slice(2, 10)}`;
}
function listQuotes() {
    return quotes;
}
function createQuote(input) {
    const totalGbp = Number(input.lines.reduce((sum, line) => sum + line.amountGbp, 0).toFixed(2));
    const quote = { id: makeId(), ...input, status: "draft", totalGbp };
    quotes.push(quote);
    return quote;
}
function updateQuoteStatus(quoteId, status) {
    const quote = quotes.find((item) => item.id === quoteId);
    if (!quote)
        return null;
    quote.status = status;
    return quote;
}
