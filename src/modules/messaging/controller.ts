import { Request, Response } from "express";
import { blockSchema, createConversationSchema, readReceiptSchema, reportSchema, sendMessageSchema } from "./schema";
import { addBlock, addReport, createConversation, listConversations, listMessages, listReports, markRead, sendMessage } from "./service";

export function listConversationsController(req: Request, res: Response) {
  res.json(listConversations(String(req.query.userId ?? "")));
}

export function createConversationController(req: Request, res: Response) {
  const parsed = createConversationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(createConversation(parsed.data as any));
}

export function listMessagesController(req: Request, res: Response) {
  res.json({ messages: listMessages(String(req.params.conversationId)) });
}

export function sendMessageController(req: Request, res: Response) {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(sendMessage(String(req.params.conversationId), parsed.data as any));
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}

export function markReadController(req: Request, res: Response) {
  const parsed = readReceiptSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.json(markRead(parsed.data.messageId, parsed.data.userId));
}

export function blockController(req: Request, res: Response) {
  const parsed = blockSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(addBlock(parsed.data));
}

export function reportController(req: Request, res: Response) {
  const parsed = reportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  res.status(201).json(addReport(parsed.data));
}

export function listReportsController(_req: Request, res: Response) {
  res.json(listReports());
}

