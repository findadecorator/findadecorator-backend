import { z } from "zod";

export const createConversationSchema = z.object({
  title: z.string().min(1),
  participantIds: z.array(z.string().min(1)).min(2),
  jobId: z.string().optional()
});

export const sendMessageSchema = z.object({
  body: z.string().min(1),
  senderId: z.string().min(1),
  attachmentIds: z.array(z.string()).optional()
});

export const readReceiptSchema = z.object({
  messageId: z.string().min(1),
  userId: z.string().min(1)
});

export const blockSchema = z.object({
  blockerId: z.string().min(1),
  blockedId: z.string().min(1),
  reason: z.string().min(3)
});

export const reportSchema = z.object({
  authorId: z.string().min(1),
  subjectId: z.string().min(1),
  reason: z.string().min(3)
});

