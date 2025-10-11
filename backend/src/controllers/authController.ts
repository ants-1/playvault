import { Request, Response } from "express";
import * as authService from "../services/authService";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.signUp(name, email, password);

    res.status(201).json({ message: "Sign-up successful", user, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
