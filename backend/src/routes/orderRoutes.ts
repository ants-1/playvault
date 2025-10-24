import { Router } from "express";
import * as orderController from "../controllers/orderController";

const router = Router();

// Orders
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.get("/customers/:customerId", orderController.getOrdersByCustomer);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

// Order Products
router.post("/:orderId/products", orderController.addProductsToOrder);
router.put("/products/:orderDetailId", orderController.updateOrderProduct);
router.delete(
  "/:orderId/products/:productId",
  orderController.deleteOrderProduct
);

export default router;
