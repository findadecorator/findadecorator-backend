import { Request, Response } from "express";
import { createBookingSchema, updateStatusSchema } from "./schema";
import { createBooking, listBookings, updateBookingStatus } from "./service";

export function listBookingsController(_req: Request, res: Response) {
  res.json(listBookings());
}

export function createBookingController(req: Request, res: Response) {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createBooking(parsed.data as any));
}

export function updateBookingStatusController(req: Request, res: Response) {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const booking = updateBookingStatus(String(req.params.bookingId), parsed.data.status as any);
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }
  res.json(booking);
}
