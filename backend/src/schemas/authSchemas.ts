import { z } from "zod";
import { validateData } from "../middlewares/validateMiddleware";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateSignUp = validateData(signUpSchema);
export const validateLogin = validateData(loginSchema);
