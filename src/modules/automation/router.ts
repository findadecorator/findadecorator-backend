import { Router } from "express";
import { automationController } from "./controller";

const router = Router();

router.get("/flows", automationController);

export default router;
