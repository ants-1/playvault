import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateLogin, validateSignUp } from "../schemas/authSchemas";

const router = Router();

router.post("/signup", validateSignUp, authController.signUp);
router.post("/login", validateLogin, authController.login);

export default router;
