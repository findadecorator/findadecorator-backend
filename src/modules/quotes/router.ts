import { Router } from "express";
import { createQuoteController, listQuotesController, updateQuoteStatusController } from "./controller";

const router = Router();

router.get("/", listQuotesController);
router.post("/", createQuoteController);
router.patch("/:quoteId/status", updateQuoteStatusController);

export default router;

