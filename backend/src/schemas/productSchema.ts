import { z } from "zod";
import { validateData } from "../middlewares/validateMiddleware";

const productSchema = z.object({
  name: z.string().min(1, "Product name cannot be empty"),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  price: z.number().min(0, "Price cannot be negative"),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.number().min(1, "Invalid category ID"),
});

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name cannot be empty").optional(),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity cannot be negative").optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.number().min(1, "Invalid category ID").optional(),
});

export const validateProduct = validateData(productSchema);
export const validateUpdateProduct = validateData(updateProductSchema);
