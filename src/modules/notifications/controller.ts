import { Request, Response } from "express";
import { preferenceSchema, sendNotificationSchema } from "./schema";
import { getPreference, listNotifications, sendNotification, updatePreference } from "./service";

export function sendNotificationController(req: Request, res: Response) {
  const parsed = sendNotificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(sendNotification(parsed.data as any));
}

export function listNotificationsController(req: Request, res: Response) {
  const userId = req.query.userId ? String(req.query.userId) : undefined;
  res.json(listNotifications(userId));
}

export function updatePreferenceController(req: Request, res: Response) {
  const parsed = preferenceSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.json(updatePreference(parsed.data as any));
}

export function getPreferenceController(req: Request, res: Response) {
  const userId = String(req.query.userId ?? "");
  if (!userId) {
    res.status(400).json({ error: "userId query is required" });
    return;
  }
  res.json(getPreference(userId));
}
