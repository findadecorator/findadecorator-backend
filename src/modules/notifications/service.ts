const notifications: Array<{
  id: string;
  userId: string;
  type: string;
  channel: "email" | "in_app";
  payload: Record<string, unknown>;
  status: "queued" | "sent";
  template: string;
}> = [];

const preferences = new Map<string, { email: boolean; in_app: boolean }>();

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function sendNotification(input: { userId: string; type: string; channel: "email" | "in_app"; payload: Record<string, unknown> }) {
  const pref = preferences.get(input.userId) ?? { email: true, in_app: true };
  if ((input.channel === "email" && !pref.email) || (input.channel === "in_app" && !pref.in_app)) {
    return { skipped: true };
  }
  const notification = {
    id: makeId("notif"),
    ...input,
    status: "sent" as const,
    template: `${input.type}.${input.channel}`
  };
  notifications.push(notification);
  return notification;
}

export function listNotifications(userId?: string) {
  return userId ? notifications.filter((notification) => notification.userId === userId) : notifications;
}

export function updatePreference(input: { userId: string; channel: "email" | "in_app"; enabled: boolean }) {
  const current = preferences.get(input.userId) ?? { email: true, in_app: true };
  if (input.channel === "email") current.email = input.enabled;
  if (input.channel === "in_app") current.in_app = input.enabled;
  preferences.set(input.userId, current);
  return current;
}

export function getPreference(userId: string) {
  return preferences.get(userId) ?? { email: true, in_app: true };
}

