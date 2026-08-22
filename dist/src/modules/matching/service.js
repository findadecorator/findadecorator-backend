"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMatching = runMatching;
const professionals = [
    { id: "pro_01", services: ["painting"], regions: ["NW", "N1"], qualityScore: 0.92, availabilityScore: 0.8, distanceScore: 0.9 },
    { id: "pro_02", services: ["painting", "wallpaper"], regions: ["SE", "N1"], qualityScore: 0.88, availabilityScore: 0.95, distanceScore: 0.82 },
    { id: "pro_03", services: ["painting"], regions: ["NW"], qualityScore: 0.75, availabilityScore: 0.7, distanceScore: 0.95 }
];
function runMatching(input) {
    return professionals
        .filter((pro) => pro.services.includes(input.serviceType) && pro.regions.includes(input.region))
        .map((pro) => {
        const score = Number((pro.qualityScore * 0.45 + pro.availabilityScore * 0.3 + pro.distanceScore * 0.25).toFixed(4));
        return { ...pro, score, jobId: input.jobId };
    })
        .sort((a, b) => b.score - a.score);
}
