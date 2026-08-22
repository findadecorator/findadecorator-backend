const bookings: Array<{
  id: string;
  jobId: string;
  quoteId: string;
  clientId: string;
  professionalId: string;
  startDate: string;
  status: "created" | "confirmed" | "in_progress" | "completed" | "cancelled";
  milestones: Array<{ status: string; at: string }>;
}> = [];

function makeId(): string {
  return `book_${Math.random().toString(36).slice(2, 10)}`;
}

export function listBookings() {
  return bookings;
}

export function createBooking(input: { jobId: string; quoteId: string; clientId: string; professionalId: string; startDate: string }) {
  const booking = {
    id: makeId(),
    ...input,
    status: "created" as const,
    milestones: [{ status: "created", at: new Date().toISOString() }]
  };
  bookings.push(booking);
  return booking;
}

export function updateBookingStatus(bookingId: string, status: "created" | "confirmed" | "in_progress" | "completed" | "cancelled") {
  const booking = bookings.find((entry) => entry.id === bookingId);
  if (!booking) return null;
  booking.status = status;
  booking.milestones.push({ status, at: new Date().toISOString() });
  return booking;
}

