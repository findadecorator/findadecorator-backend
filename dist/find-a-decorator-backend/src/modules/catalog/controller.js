"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = productsController;
exports.recommendationsController = recommendationsController;
exports.featuredBrandsController = featuredBrandsController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function productsController(req, res) {
    const parsed = schema_1.productQuerySchema.safeParse(req.query);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    res.json((0, service_1.listProducts)(parsed.data.category));
}
function recommendationsController(req, res) {
    const parsed = schema_1.productQuerySchema.safeParse(req.query);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    res.json((0, service_1.getRecommendations)(parsed.data.jobType ?? "bedroom"));
}
function featuredBrandsController(_req, res) {
    res.json((0, service_1.getFeaturedBrands)());
}
