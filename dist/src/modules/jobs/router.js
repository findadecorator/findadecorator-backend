"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get("/", controller_1.listJobsController);
router.post("/", controller_1.createJobController);
router.patch("/:jobId/status", controller_1.updateJobStatusController);
exports.default = router;
