import { NextFunction, Request, Response } from "express";
import * as authService from "../services/authService";
import { generateToken } from "../utils/generateToken";
import passport from "passport";

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

export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error, user: any) => {
      if (err || !user) {
        return res.status(400).json({ error: "Google authentication failed" });
      }

      try {
        const token = generateToken(user.id);

        const redirectUrl = new URL(
          `${process.env.CLIENT_URL}/google/callback`
        );
        redirectUrl.searchParams.append("token", token);
        redirectUrl.searchParams.append("userId", user.id.toString());
        redirectUrl.searchParams.append("name", user.name);
        redirectUrl.searchParams.append("email", user.email);

        res.redirect(redirectUrl.toString());
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.logout((err) => {
      if (err) return next(err);
      return res
        .status(200)
        .json({ success: true, message: "Logout successful." });
    });
  } catch (err) {
    next(err);
  }
};
