import { Router } from "express";
import * as orderController from "../controllers/orderController";
import {
  validateOrder,
  validateUpdateOrder,
  validateAddProductsToOrder,
  validateUpdateOrderProduct,
} from "../schemas/orderSchema";

const router = Router();

// Orders
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.get("/customers/:customerId", orderController.getOrdersByCustomer);
router.post("/", validateOrder, orderController.createOrder);
router.put("/:id", validateUpdateOrder, orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

// Order Products
router.post(
  "/:orderId/products",
  validateAddProductsToOrder,
  orderController.addProductsToOrder
);
router.put("/products/:orderDetailId", orderController.updateOrderProduct);
router.delete(
  "/:orderId/products/:productId",
  validateUpdateOrderProduct,
  orderController.deleteOrderProduct
);

export default router;
