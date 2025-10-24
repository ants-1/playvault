import { z } from "zod";
import { validateData } from "../middlewares/validateMiddleware";

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
});

const updateUserPasswordSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  oldPassword: z.string().min(6, "Old password must be at least 6 characters"),
});

export const validateUpdateUser = validateData(updateUserSchema);
export const validateUpdateUserPassword = validateData(
  updateUserPasswordSchema
);
