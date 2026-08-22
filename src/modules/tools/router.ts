import { Router } from "express";
import {
  budgetEstimatorController,
  colourGuideController,
  paintCalculatorController,
  prepChecklistController,
  quoteTemplateController,
  surfaceAreaController,
  wallpaperCalculatorController
} from "./controller";

const router = Router();

router.post("/paint", paintCalculatorController);
router.post("/wallpaper", wallpaperCalculatorController);
router.post("/surface-area", surfaceAreaController);
router.post("/quote-template", quoteTemplateController);
router.post("/budget-estimator", budgetEstimatorController);
router.get("/prep-checklist", prepChecklistController);
router.get("/colour-guide", colourGuideController);

export default router;
