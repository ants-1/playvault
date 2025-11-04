import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const { user, token } = await authService.signUp(name, email, password);

    res.status(201).json({ message: "Sign-up successful", user, token });
  } catch (error: any) {
    if (error.name === "ConflictError") {
      return res.status(409).json({ error: error.message });
    }

    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error: any) {
    if (error.name === "AuthenticationError") {
      return res.status(401).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const logout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

}

export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
}