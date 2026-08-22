import { Router } from "express";
import {
  blockController,
  createConversationController,
  listConversationsController,
  listReportsController,
  listMessagesController,
  markReadController,
  reportController,
  sendMessageController
} from "./controller";

const router = Router();

router.get("/conversations", listConversationsController);
router.post("/conversations", createConversationController);
router.get("/conversations/:conversationId/messages", listMessagesController);
router.post("/conversations/:conversationId/messages", sendMessageController);
router.post("/messages/read", markReadController);
router.post("/blocks", blockController);
router.post("/reports", reportController);
router.get("/reports", listReportsController);

export default router;
