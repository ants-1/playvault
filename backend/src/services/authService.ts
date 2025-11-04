import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { generateToken } from "../utils/generateToken";
import { User } from "../../generated/prisma";

export const signUp = async (name: string, email: string, password: string) => {
  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser: User = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token: string = generateToken(newUser.id);

    return { user: newUser, token };
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("User was not registered.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    if (error.code === "P2002") {
      const conflictError: Error = new Error("Email address already used.");
      conflictError.name = "ConflictError";
      throw conflictError;
    }

    console.error("Failed to register user", error);
    throw new Error("Failed to register user.");
  }
};

export const login = async (email: string, password: string) => {
  try {
    const user: User | null = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const authError: Error = new Error("Invalid credentials.");
      authError.name = "AuthenticationError";
      throw authError;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const authError: Error = new Error("Invalid passowrd.");
      authError.name = "AuthenticationError";
      throw authError;
    }

    const token: string = generateToken(user.id);

    return { user, token };
  } catch (error: any) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logout = async () => {

}

export const googleCallback = async (

) => {
  
}