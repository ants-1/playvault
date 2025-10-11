import { Router } from "express";
import * as userController from "../controllers/userController";
import { authenticateJWT } from "../middlewares/authenticateJWT";

const router = Router();

router.get("/", authenticateJWT, userController.getUsers);
router.get("/:id", authenticateJWT, userController.getUser);
router.put("/:id", authenticateJWT, userController.updateUser);
router.put("/:id/password", authenticateJWT, userController.updateUserPassword);

export default router;
