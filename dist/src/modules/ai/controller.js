"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteAssistantController = quoteAssistantController;
exports.colourAdvisorController = colourAdvisorController;
exports.jobClassifierController = jobClassifierController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function quoteAssistantController(req, res) {
    const parsed = schema_1.quoteAssistantSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (!data.jobDescription || data.jobDescription.length < 10)
        return res.status(400).json({ error: "jobDescription must be at least 10 characters" });
    res.json((0, service_1.suggestQuoteAssistant)(data));
}
function colourAdvisorController(req, res) {
    const parsed = schema_1.colourAdvisorSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (data.roomPhotoUrl && !/^https?:\/\//.test(String(data.roomPhotoUrl)))
        return res.status(400).json({ error: "roomPhotoUrl must be a valid http(s) URL" });
    res.json((0, service_1.suggestColourAdvisor)(data));
}
function jobClassifierController(req, res) {
    const parsed = schema_1.jobClassifierSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (!data.jobDescription || data.jobDescription.length < 10)
        return res.status(400).json({ error: "jobDescription must be at least 10 characters" });
    res.json((0, service_1.classifyJob)(data));
}
