import { z } from "zod";
import { validateData } from "../middlewares/validateMiddleware";

const orderSchema = z.object({
  customerId: z.number().min(1, "Invalid customer ID"),
  orderEmail: z.email("Invalid email address"),
  orderStatus: z.string().min(1, "Order status cannot be empty"),
  orderDetails: z
    .array(
      z.object({
        productId: z.number().min(1, "Invalid product ID"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .optional(),
});

const updateOrderSchema = z.object({
  email :z.string().min(1, "Email address cannot be empty").optional(),
  orderStatus: z.string().min(1, "Order status cannot be empty").optional(),
  shippingAddress: z
    .string()
    .min(1, "Shipping address cannot be empty")
    .optional(),
  orderAddress: z.string().min(1, "Order address cannot be empty").optional(),
});

const addProductsToOrderSchema = z.object({
  productId: z.number().min(1, "Invalid product ID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

const updateOrderProductSchema = z.object({
  updates: z
    .array(
      z.object({
        orderDetailId: z.number().min(1, "Invalid order detail ID"),
        quantity: z.number().min(1, "Quantity must be at least 1").optional(),
      })
    )
    .optional(),
});

export const validateOrder = validateData(orderSchema);
export const validateUpdateOrder = validateData(updateOrderSchema);
export const validateAddProductsToOrder = validateData(
  addProductsToOrderSchema
);
export const validateUpdateOrderProduct = validateData(
  updateOrderProductSchema
);
