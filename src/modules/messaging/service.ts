import { emitEvent } from "../../lib/realtime";

interface Conversation {
  id: string;
  title: string;
  participantIds: string[];
  jobId?: string;
  updatedAt: string;
  createdAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachmentIds?: string[];
  createdAt: string;
}

const conversations = new Map<string, Conversation>();
const messages = new Map<string, Message[]>();
const receipts = new Map<string, Set<string>>();
const blocks = new Map<string, { blockerId: string; blockedId: string; reason: string }>();
const reports: Array<{ id: string; authorId: string; subjectId: string; reason: string; createdAt: string }> = [];

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listConversations(userId?: string) {
  return Array.from(conversations.values())
    .filter((conversation) => !userId || conversation.participantIds.includes(userId))
    .map((conversation) => {
      const thread = messages.get(conversation.id) ?? [];
      const last = thread[thread.length - 1];
      return {
        id: conversation.id,
        title: conversation.title,
        unread: false,
        lastMessageBody: last?.body ?? "",
        lastMessageAt: last?.createdAt ?? conversation.updatedAt
      };
    });
}

export function createConversation(input: { title: string; participantIds: string[]; jobId?: string }) {
  const now = new Date().toISOString();
  const conversation: Conversation = {
    id: makeId("conv"),
    title: input.title,
    participantIds: input.participantIds,
    jobId: input.jobId,
    createdAt: now,
    updatedAt: now
  };
  conversations.set(conversation.id, conversation);
  messages.set(conversation.id, []);
  return conversation;
}

export function listMessages(conversationId: string) {
  return messages.get(conversationId) ?? [];
}

export function sendMessage(conversationId: string, input: { senderId: string; body: string; attachmentIds?: string[] }) {
  const conversation = conversations.get(conversationId);
  if (!conversation) {
    throw new Error("Conversation not found");
  }
  const blocked = blocks.get(`${input.senderId}:${conversationId}`);
  if (blocked) {
    throw new Error("Messaging blocked in this thread");
  }
  const message: Message = {
    id: makeId("msg"),
    conversationId,
    senderId: input.senderId,
    body: input.body,
    attachmentIds: input.attachmentIds,
    createdAt: new Date().toISOString()
  };
  const current = messages.get(conversationId) ?? [];
  current.push(message);
  messages.set(conversationId, current);
  conversations.set(conversationId, { ...conversation, updatedAt: message.createdAt });
  emitEvent(`conversation:${conversationId}`, "message:new", message);
  emitEvent(`conversation:${conversationId}`, "conversation:update", {
    conversationId,
    lastMessageBody: message.body,
    lastMessageAt: message.createdAt
  });
  return message;
}

export function markRead(messageId: string, userId: string) {
  const set = receipts.get(messageId) ?? new Set<string>();
  set.add(userId);
  receipts.set(messageId, set);
  return { messageId, userId, readAt: new Date().toISOString() };
}

export function addBlock(input: { blockerId: string; blockedId: string; reason: string }) {
  blocks.set(`${input.blockerId}:${input.blockedId}`, input);
  return input;
}

export function addReport(input: { authorId: string; subjectId: string; reason: string }) {
  const report = { id: makeId("report"), ...input, createdAt: new Date().toISOString() };
  reports.push(report);
  return report;
}

export function listReports() {
  return reports;
}

