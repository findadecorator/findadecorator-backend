"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listQuotesController = listQuotesController;
exports.createQuoteController = createQuoteController;
exports.updateQuoteStatusController = updateQuoteStatusController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listQuotesController(_req, res) {
    res.json((0, service_1.listQuotes)());
}
function createQuoteController(req, res) {
    const parsed = schema_1.createQuoteSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createQuote)(parsed.data));
}
function updateQuoteStatusController(req, res) {
    const parsed = schema_1.statusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const quote = (0, service_1.updateQuoteStatus)(String(req.params.quoteId), parsed.data.status);
    if (!quote) {
        res.status(404).json({ error: "Quote not found" });
        return;
    }
    res.json(quote);
}
