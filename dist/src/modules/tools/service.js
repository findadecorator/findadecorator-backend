"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePaint = calculatePaint;
exports.calculateWallpaper = calculateWallpaper;
exports.calculateSurfaceArea = calculateSurfaceArea;
exports.generateQuoteTemplate = generateQuoteTemplate;
exports.estimateBudget = estimateBudget;
exports.getPrepChecklist = getPrepChecklist;
exports.getColourGuide = getColourGuide;
const rules_1 = require("../../../pricing-engine/rules");
function calculatePaint(input) {
    const wallArea = (input.roomLength * input.roomHeight * 2) + (input.roomWidth * input.roomHeight * 2);
    const litres = Math.max(1, Math.ceil((wallArea * input.coats) / input.paintCoverage));
    const cost = litres * (input.paintType === "matt" ? 18 : input.paintType === "satin" ? 22 : 28);
    const recommendedBrands = ["Dulux Easycare", "Johnstone's Coving White", "Farrow & Ball Estate Emulsion"];
    return { litres, costGbp: Number(cost.toFixed(2)), recommendedBrands, wallArea };
}
function calculateWallpaper(input) {
    const wallArea = input.wallWidth * input.wallHeight;
    const usableLength = input.rollLength - input.patternRepeat;
    const rollsNeeded = Math.max(1, Math.ceil((wallArea / (input.rollWidth * usableLength)) * (1 + input.wastePercent / 100)));
    const cost = rollsNeeded * 24;
    return { rollsNeeded, wasteFactor: Number(((input.wastePercent / 100) * 100).toFixed(1)), costGbp: Number(cost.toFixed(2)), wallArea };
}
function calculateSurfaceArea(input) {
    const total = input.wallArea + input.ceilingArea + input.trimArea - (input.doorArea + input.windowArea);
    return { totalSquareMetres: Number(total.toFixed(2)), breakdown: input };
}
function generateQuoteTemplate(input) {
    const baseRate = rules_1.PRICING_RULES_V1.jobValueAnchorsGbp.small / 10;
    const labour = Math.round((baseRate * input.rooms) * (input.projectType === "kitchen" ? 1.2 : 1));
    const materials = Math.round((input.rooms * 75) * (input.finishType === "premium" ? 1.4 : 1));
    return {
        projectType: input.projectType,
        rooms: input.rooms,
        finishType: input.finishType,
        template: [
            "Prep, mask and protect surfaces",
            "Prime where required",
            "Apply two coats to walls and ceilings",
            "Cut in and finish trims"
        ],
        estimateGbp: labour + materials,
        labourGbp: labour,
        materialsGbp: materials
    };
}
function estimateBudget(input) {
    const roomMultiplier = input.condition === "poor" ? 1.45 : input.condition === "average" ? 1.2 : 1;
    const finishMultiplier = input.finish === "premium" ? 1.35 : 1;
    const min = 280 * input.rooms * roomMultiplier;
    const max = 1000 * input.rooms * finishMultiplier * roomMultiplier;
    return { minGbp: Number(min.toFixed(2)), maxGbp: Number(max.toFixed(2)), rangeLabel: `£${Math.round(min)}–£${Math.round(max)}` };
}
function getPrepChecklist() {
    return {
        beforeBooking: [
            "Confirm access times and parking",
            "Check electrical points and masking requirements",
            "Review any damp or patching issues"
        ],
        beforePainting: [
            "Move furniture away from walls",
            "Clean surfaces and repair cracks",
            "Protect floors, fixtures and fittings"
        ]
    };
}
function getColourGuide() {
    return {
        matt: { summary: "Best for low-traffic rooms, hides imperfections and creates a soft finish.", rooms: ["living rooms", "bedrooms"] },
        satin: { summary: "Durable and easy to clean, ideal for kitchens and bathrooms.", rooms: ["kitchens", "bathrooms", "hallways"] },
        gloss: { summary: "High sheen, very washable, best for trims and doors.", rooms: ["doors", "trim", "cabinetry"] }
    };
}
