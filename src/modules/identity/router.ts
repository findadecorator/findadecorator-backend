import { Router } from "express";
import {
  adminMfaController,
  forgotPasswordController,
  loginController,
  logoutController,
  meController,
  registerController,
  resetPasswordController,
  verifyEmailController
} from "./controller";

const router = Router();

router.post("/register", registerController);
router.post("/signup", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/me", meController);
router.post("/verify-email", verifyEmailController);
router.post("/verify", verifyEmailController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/reset", resetPasswordController);
router.post("/mfa/admin/challenge", (_req, res) => res.json({ required: true, channel: "authenticator-app" }));
router.post("/mfa/admin/verify", adminMfaController);

export default router;
