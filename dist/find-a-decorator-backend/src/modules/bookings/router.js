"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get("/", controller_1.listBookingsController);
router.post("/", controller_1.createBookingController);
router.patch("/:bookingId/status", controller_1.updateBookingStatusController);
exports.default = router;
