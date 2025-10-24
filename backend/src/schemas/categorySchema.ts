import { z } from "zod";
import { validateData } from "../middlewares/validateMiddleware";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Category description is required"),
  thumbnail: z.string().optional(),
});

const updateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const validateCategory = validateData(categorySchema);
export const validateUpdateCategory = validateData(updateCategorySchema);