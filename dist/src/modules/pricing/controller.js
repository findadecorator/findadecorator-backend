"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRulesController = getRulesController;
exports.getRuleVersionsController = getRuleVersionsController;
exports.quoteController = quoteController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function getRulesController(_req, res) {
    res.json((0, service_1.getRules)());
}
function getRuleVersionsController(_req, res) {
    res.json((0, service_1.getRuleVersions)());
}
function quoteController(req, res) {
    const parsed = schema_1.pricingInputSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.json((0, service_1.calculatePrice)(parsed.data));
}
