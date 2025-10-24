import { Router } from "express";
import * as categoryController from "../controllers/categoryController";
import {
  validateCategory,
  validateUpdateCategory,
} from "../schemas/categorySchema";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", validateCategory, categoryController.addCategory);
router.put("/:id", validateUpdateCategory, categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
