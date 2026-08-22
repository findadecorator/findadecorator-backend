"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get("/products", controller_1.productsController);
router.get("/recommendations", controller_1.recommendationsController);
router.get("/featured-brands", controller_1.featuredBrandsController);
exports.default = router;
