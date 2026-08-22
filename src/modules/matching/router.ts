import { Router } from "express";
import { runMatchingController } from "./controller";

const router = Router();

router.post("/run", runMatchingController);

export default router;

