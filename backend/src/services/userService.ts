import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      omit: { password: true },
    });

    if (!users || users.length === 0) {
      throw new Error("No users found.");
    }

    return users;
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  }
};

export const getUser = async (id: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  } catch (error: any) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const updaterUser = async (id: number, name: string, email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (name === "" || email === "") {
      throw new Error("Ensure all fields are not empty.");
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
      omit: { password: true },
    });
    return { updatedUser };
  } catch (error: any) {
    console.error("Failed to update user:", error);
    throw new Error("Failed to update user");
  }
};

export const updateUserPassword = async (
  id: number,
  oldPassword: string,
  newPassword: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error("Incorrect current password.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully." };
  } catch (error: any) {
    console.error("Failed to update password:", error);
    throw new Error("Failed to update password.");
  }
};
