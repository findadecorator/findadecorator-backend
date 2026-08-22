"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post("/quote-assistant", controller_1.quoteAssistantController);
router.post("/colour-advisor", controller_1.colourAdvisorController);
router.post("/job-classifier", controller_1.jobClassifierController);
exports.default = router;
