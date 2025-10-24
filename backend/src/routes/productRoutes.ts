import { Router } from "express";
import * as productController from "../controllers/productController";
import {
  validateProduct,
  validateUpdateProduct,
} from "../schemas/productSchema";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", validateProduct, productController.addProduct);
router.put("/:id", validateUpdateProduct, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
