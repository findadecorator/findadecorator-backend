"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookingsController = listBookingsController;
exports.createBookingController = createBookingController;
exports.updateBookingStatusController = updateBookingStatusController;
const schema_1 = require("./schema");
const service_1 = require("./service");
function listBookingsController(_req, res) {
    res.json((0, service_1.listBookings)());
}
function createBookingController(req, res) {
    const parsed = schema_1.createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    res.status(201).json((0, service_1.createBooking)(parsed.data));
}
function updateBookingStatusController(req, res) {
    const parsed = schema_1.updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const booking = (0, service_1.updateBookingStatus)(String(req.params.bookingId), parsed.data.status);
    if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
    }
    res.json(booking);
}
