import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authenticateJWT";
import {
  validateUpdateUser,
  validateUpdateUserPassword,
} from "../schemas/userSchema";

const router = Router();

router.get("/", authenticateJWT, userController.getUsers);
router.get("/:id", authenticateJWT, userController.getUser);
router.put(
  "/:id",
  authenticateJWT,
  validateUpdateUser,
  userController.updateUser
);
router.put(
  "/:id/password",
  authenticateJWT,
  validateUpdateUserPassword,
  userController.updateUserPassword
);

export default router;
