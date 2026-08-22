import { Router } from "express";
import { enterpriseController } from "./controller";

const router = Router();

router.get("/plan", enterpriseController);

export default router;
