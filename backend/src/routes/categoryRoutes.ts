import { Router } from "express";
import * as categoryController from "../controllers/categoryController";

const router = Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);
router.post("/", categoryController.addCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
