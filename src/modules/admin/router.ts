import { Router } from "express";
import {
  auditLogsController,
  ceoOverviewController,
  fraudQueueController,
  metricsController,
  moderationQueueController,
  pricingVersionsController,
  queueActionController,
  refundQueueController,
  verificationQueueController
} from "./controller";

const router = Router();

router.get("/verification-queue", verificationQueueController);
router.get("/moderation-queue", moderationQueueController);
router.get("/refund-queue", refundQueueController);
router.get("/fraud-queue", fraudQueueController);
router.get("/pricing-versions", pricingVersionsController);
router.get("/metrics", metricsController);
router.get("/ceo-overview", ceoOverviewController);
router.get("/audit-logs", auditLogsController);
router.post("/queue-action", queueActionController);

export default router;

