import { Router } from "express";
import {
  createLeadController,
  ledgerController,
  listLeadsController,
  listRefundsController,
  previewLeadController,
  requestRefundController,
  topUpController,
  unlockLeadController,
  walletController
} from "./controller";

const router = Router();

router.get("/", listLeadsController);
router.post("/", createLeadController);
router.post("/preview", previewLeadController);
router.post("/unlock", unlockLeadController);
router.post("/top-up", topUpController);
router.get("/wallet", walletController);
router.get("/balance", walletController);
router.get("/ledger", ledgerController);
router.post("/refunds", requestRefundController);
router.get("/refunds", listRefundsController);

export default router;
