import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import {
  validateCategory,
  validateUpdateCategory,
} from "../schemas/categorySchema";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post(
  "/",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  validateCategory,
  categoryController.addCategory
);
router.put(
  "/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  validateUpdateCategory,
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCategory);

export default router;
