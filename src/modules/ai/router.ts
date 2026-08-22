import { Router } from "express";
import { colourAdvisorController, jobClassifierController, quoteAssistantController } from "./controller";

const router = Router();

router.post("/quote-assistant", quoteAssistantController);
router.post("/colour-advisor", colourAdvisorController);
router.post("/job-classifier", jobClassifierController);

export default router;
