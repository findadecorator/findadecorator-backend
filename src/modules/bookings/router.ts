import { Router } from "express";
import { createBookingController, listBookingsController, updateBookingStatusController } from "./controller";

const router = Router();

router.get("/", listBookingsController);
router.post("/", createBookingController);
router.patch("/:bookingId/status", updateBookingStatusController);

export default router;

