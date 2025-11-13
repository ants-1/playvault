import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateLogin, validateSignUp } from "../schemas/authSchemas";
import passport from "passport";

const router = Router();

router.post("/signup", validateSignUp, authController.signUp);
router.post("/login", validateLogin, authController.login);
router.post("/logout", authController.logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", authController.googleCallback);
router.post("/guest", authController.guestLogin);

export default router;
