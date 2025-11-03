import { Router } from "express";
import * as productController from "../controllers/productController";
import {
  validateProduct,
  validateUpdateProduct,
} from "../schemas/productSchema";
import { uploadFields } from "../utils/uploadFields";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProduct);
router.post("/", uploadFields, validateProduct, productController.addProduct);
router.put(
  "/:id",
  uploadFields,
  validateUpdateProduct,
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
