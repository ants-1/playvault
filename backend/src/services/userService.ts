import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      skip,
      take: limit,
      omit: { password: true },
      orderBy: { id: "asc" },
    });

    if (!users || users.length === 0) {
      throw new Error("No users found.");
    }

    const total = await prisma.user.count();
    const totalPages = Math.ceil(total / limit);

    return {
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    throw new Error("Failed to fetch users.");
  }
};

export const getUser = async (id: number) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      omit: { password: true },
    });

    return user;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError = new Error("User not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
};

export const updaterUser = async (id: number, name: string, email: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
      omit: { password: true },
    });

    return { updatedUser };
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError = new Error("User not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    if (error.code === "P2002") {
      const conflictError = new Error("User email already exists.");
      conflictError.name = "ConflictError";
      throw conflictError;
    }

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
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      const authError = new Error("Passwords do not match.");
      authError.name = "AuthenticationError";
      throw authError;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully." };
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError = new Error("User not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to update password:", error);
    throw new Error("Failed to update password.");
  }
};
