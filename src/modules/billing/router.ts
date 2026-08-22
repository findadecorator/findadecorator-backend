import { Router } from "express";
import {
  checkoutController,
  invoicesController,
  listRefundsController,
  receiptEmailController,
  receiptsController,
  refundController,
  statementsController,
  vatSummaryController,
  webhookController
} from "./controller";

const router = Router();

router.post("/checkout", checkoutController);
router.post("/webhook", webhookController);
router.get("/invoices", invoicesController);
router.get("/receipts/:invoiceId", receiptsController);
router.post("/receipts/email", receiptEmailController);
router.get("/statements", statementsController);
router.get("/vat-summary", vatSummaryController);
router.post("/refunds", refundController);
router.get("/refunds", listRefundsController);

export default router;

