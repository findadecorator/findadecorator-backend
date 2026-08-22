"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReviews = listReviews;
exports.createReview = createReview;
exports.moderateReview = moderateReview;
exports.createAppeal = createAppeal;
exports.listAppeals = listAppeals;
const reviews = [];
const appeals = [];
function makeId(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function listReviews() {
    return reviews;
}
function createReview(input) {
    const fraudSignals = [];
    if (input.rating === 5 && /money back|cash only|outside platform/i.test(input.body)) {
        fraudSignals.push("suspicious-keywords");
    }
    const review = {
        id: makeId("review"),
        ...input,
        verifiedJob: true,
        fraudSignals,
        moderationStatus: "pending"
    };
    reviews.push(review);
    return review;
}
function moderateReview(reviewId, action) {
    const review = reviews.find((item) => item.id === reviewId);
    if (!review)
        return null;
    if (action === "approve")
        review.moderationStatus = "approved";
    if (action === "hide")
        review.moderationStatus = "hidden";
    if (action === "flag")
        review.fraudSignals.push("manual-flag");
    return review;
}
function createAppeal(input) {
    const appeal = { id: makeId("appeal"), ...input, status: "open" };
    appeals.push(appeal);
    return appeal;
}
function listAppeals() {
    return appeals;
}
