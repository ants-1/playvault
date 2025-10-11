import { Request, Response } from "express";
import * as userService from "../services/userService";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();

    return res.status(200).json({ users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.getUser(id);

    res.status(200).json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email } = req.body;

    const updatedUser = await userService.updaterUser(id, name, email);

    res.status(200).json({ updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
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
