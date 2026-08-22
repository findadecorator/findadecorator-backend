import { Router } from "express";
import { getPreferenceController, listNotificationsController, sendNotificationController, updatePreferenceController } from "./controller";

const router = Router();

router.get("/", listNotificationsController);
router.post("/", sendNotificationController);
router.get("/preferences", getPreferenceController);
router.post("/preferences", updatePreferenceController);

export default router;

