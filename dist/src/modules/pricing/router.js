"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get("/rules", controller_1.getRulesController);
router.get("/versions", controller_1.getRuleVersionsController);
router.post("/quote", controller_1.quoteController);
exports.default = router;
