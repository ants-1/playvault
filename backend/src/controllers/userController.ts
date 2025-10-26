import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) | 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const users = await userService.getUsers(page, limit);

    return res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user = await userService.getUser(id);

    res.status(200).json({ user });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const { name, email } = req.body;

    const updatedUser = await userService.updaterUser(id, name, email);

    res.status(200).json({ updatedUser });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    if (error.name === "ConflictError") {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { oldPassword, newPassword } = req.body;

    const result = await userService.updateUserPassword(
      id,
      oldPassword,
      newPassword
    );

    res.status(200).json({ result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
