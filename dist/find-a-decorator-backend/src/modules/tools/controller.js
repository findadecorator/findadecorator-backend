"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paintCalculatorController = paintCalculatorController;
exports.wallpaperCalculatorController = wallpaperCalculatorController;
exports.surfaceAreaController = surfaceAreaController;
exports.quoteTemplateController = quoteTemplateController;
exports.budgetEstimatorController = budgetEstimatorController;
exports.prepChecklistController = prepChecklistController;
exports.colourGuideController = colourGuideController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function paintCalculatorController(req, res) {
    const parsed = schema_1.paintCalculatorSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (["matt", "satin", "gloss"].includes(data.paintType) === false)
        return res.status(400).json({ error: "Invalid paintType" });
    if (data.roomLength <= 0 || data.roomWidth <= 0 || data.roomHeight <= 0 || data.paintCoverage <= 0)
        return res.status(400).json({ error: "Positive dimensions are required" });
    res.json((0, service_1.calculatePaint)(data));
}
function wallpaperCalculatorController(req, res) {
    const parsed = schema_1.wallpaperCalculatorSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (data.wallWidth <= 0 || data.wallHeight <= 0 || data.rollWidth <= 0 || data.rollLength <= 0)
        return res.status(400).json({ error: "Positive wall and roll dimensions are required" });
    if (data.wastePercent < 0 || data.wastePercent > 30)
        return res.status(400).json({ error: "wastePercent must be between 0 and 30" });
    res.json((0, service_1.calculateWallpaper)(data));
}
function surfaceAreaController(req, res) {
    const parsed = schema_1.surfaceAreaSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    res.json((0, service_1.calculateSurfaceArea)(parsed.data));
}
function quoteTemplateController(req, res) {
    const parsed = schema_1.templateSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (data.rooms < 1)
        return res.status(400).json({ error: "rooms must be at least 1" });
    res.json((0, service_1.generateQuoteTemplate)(data));
}
function budgetEstimatorController(req, res) {
    const parsed = schema_1.budgetEstimatorSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const data = parsed.data;
    if (["good", "average", "poor"].includes(data.condition) === false)
        return res.status(400).json({ error: "Invalid condition" });
    if (["standard", "premium"].includes(data.finish) === false)
        return res.status(400).json({ error: "Invalid finish" });
    res.json((0, service_1.estimateBudget)(data));
}
function prepChecklistController(_req, res) {
    res.json((0, service_1.getPrepChecklist)());
}
function colourGuideController(_req, res) {
    res.json((0, service_1.getColourGuide)());
}
