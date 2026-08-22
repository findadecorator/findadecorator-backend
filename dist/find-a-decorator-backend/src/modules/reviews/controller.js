"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviewsController = listReviewsController;
exports.createReviewController = createReviewController;
exports.moderateReviewController = moderateReviewController;
exports.appealController = appealController;
exports.listAppealsController = listAppealsController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listReviewsController(_req, res) {
    res.json((0, service_1.listReviews)());
}
function createReviewController(req, res) {
    const parsed = schema_1.createReviewSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createReview)(parsed.data));
}
function moderateReviewController(req, res) {
    const parsed = schema_1.moderationSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const review = (0, service_1.moderateReview)(parsed.data.reviewId, parsed.data.action);
    if (!review) {
        res.status(404).json({ error: "Review not found" });
        return;
    }
    res.json(review);
}
function appealController(req, res) {
    const parsed = schema_1.appealSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createAppeal)(parsed.data));
}
function listAppealsController(_req, res) {
    res.json((0, service_1.listAppeals)());
}
