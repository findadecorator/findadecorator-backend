"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMatchingController = runMatchingController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function runMatchingController(req, res) {
    const parsed = schema_1.runMatchSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.json({ matches: (0, service_1.runMatching)(parsed.data) });
}
