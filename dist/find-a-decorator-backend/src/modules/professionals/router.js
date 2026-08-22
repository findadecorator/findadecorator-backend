"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const moduleFactory_1 = require("../../shared/moduleFactory");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
(0, moduleFactory_1.bindCrudRoutes)(router, controller_1.controller);
exports.default = router;
