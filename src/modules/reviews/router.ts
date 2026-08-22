import { Router } from "express";
import { appealController, createReviewController, listAppealsController, listReviewsController, moderateReviewController } from "./controller";
import { requireRoles } from "../../middleware/auth";

const router = Router();

router.get("/", listReviewsController);
router.post("/", createReviewController);
router.post("/moderate", requireRoles(["admin", "verifier", "support"]), moderateReviewController);
router.post("/appeals", appealController);
router.get("/appeals", requireRoles(["admin", "verifier", "support"]), listAppealsController);

export default router;

