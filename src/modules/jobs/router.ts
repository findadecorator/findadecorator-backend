import { Router } from "express";
import { createJobController, listJobsController, updateJobStatusController } from "./controller";

const router = Router();

router.get("/", listJobsController);
router.post("/", createJobController);
router.patch("/:jobId/status", updateJobStatusController);

export default router;

