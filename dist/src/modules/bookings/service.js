"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listBookings = listBookings;
exports.createBooking = createBooking;
exports.updateBookingStatus = updateBookingStatus;
const bookings = [];
function makeId() {
    return `book_${Math.random().toString(36).slice(2, 10)}`;
}
function listBookings() {
    return bookings;
}
function createBooking(input) {
    const booking = {
        id: makeId(),
        ...input,
        status: "created",
        milestones: [{ status: "created", at: new Date().toISOString() }]
    };
    bookings.push(booking);
    return booking;
}
function updateBookingStatus(bookingId, status) {
    const booking = bookings.find((entry) => entry.id === bookingId);
    if (!booking)
        return null;
    booking.status = status;
    booking.milestones.push({ status, at: new Date().toISOString() });
    return booking;
}
