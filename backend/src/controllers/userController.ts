import { Request, Response } from "express";
import * as userService from "../services/userService";
import { PasswordResult, Users } from "../types/User";
import { User } from "../../generated/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const users: Users = await userService.getUsers(page, limit);

    return res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const user: Omit<User, "password"> = await userService.getUser(id);

    res.status(200).json({ data: user });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const { name, email } = req.body;

    const updatedUser: Omit<User, "password"> = await userService.updaterUser(
      id,
      name,
      email
    );

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
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
    const id: number = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const { oldPassword, newPassword } = req.body;

    const result: PasswordResult = await userService.updateUserPassword(
      id,
      oldPassword,
      newPassword
    );

    res.status(200).json(result);
  } catch (error: any) {
    if (error.name === "AuthenticationError") {
      return res.status(401).json({ error: error.message });
    }
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};
