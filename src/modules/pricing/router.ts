import { Router } from "express";
import { getRulesController, getRuleVersionsController, quoteController } from "./controller";

const router = Router();

router.get("/rules", getRulesController);
router.get("/versions", getRuleVersionsController);
router.post("/quote", quoteController);

export default router;

