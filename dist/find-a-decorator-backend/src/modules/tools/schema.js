"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetEstimatorSchema = exports.templateSchema = exports.surfaceAreaSchema = exports.wallpaperCalculatorSchema = exports.paintCalculatorSchema = void 0;
const zod_1 = require("zod");
exports.paintCalculatorSchema = zod_1.z.object({
    roomLength: zod_1.z.number().min(0),
    roomWidth: zod_1.z.number().min(0),
    roomHeight: zod_1.z.number().min(0),
    coats: zod_1.z.number().min(1),
    paintCoverage: zod_1.z.number().min(0),
    paintType: zod_1.z.enum(["matt", "satin", "gloss"]).default("matt")
});
exports.wallpaperCalculatorSchema = zod_1.z.object({
    wallWidth: zod_1.z.number().min(0),
    wallHeight: zod_1.z.number().min(0),
    patternRepeat: zod_1.z.number().nonnegative(),
    wastePercent: zod_1.z.number().nonnegative(),
    rollWidth: zod_1.z.number().min(0),
    rollLength: zod_1.z.number().min(0)
});
exports.surfaceAreaSchema = zod_1.z.object({
    wallArea: zod_1.z.number().nonnegative(),
    ceilingArea: zod_1.z.number().nonnegative(),
    trimArea: zod_1.z.number().nonnegative(),
    doorArea: zod_1.z.number().nonnegative(),
    windowArea: zod_1.z.number().nonnegative()
});
exports.templateSchema = zod_1.z.object({
    projectType: zod_1.z.string().min(2),
    rooms: zod_1.z.number().min(1),
    finishType: zod_1.z.enum(["standard", "premium"]).default("standard")
});
exports.budgetEstimatorSchema = zod_1.z.object({
    rooms: zod_1.z.number().min(1),
    condition: zod_1.z.enum(["good", "average", "poor"]).default("average"),
    finish: zod_1.z.enum(["standard", "premium"]).default("standard")
});
