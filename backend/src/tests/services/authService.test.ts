import dotenv from "dotenv";
dotenv.config();

import { signUp, login } from "../../services/authService";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("signUp", () => {
    it("should create a new user and return a token", async () => {
      const plainPassword = "password123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockUser = {
        id: 1,
        name: "Test",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        userType: "user",
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await signUp("Test", "test@example.com", plainPassword);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
    });

    it("should throw conflict error if email exists", async () => {
      const error = { code: "P2002" };
      (prisma.user.create as jest.Mock).mockRejectedValue(error);

      await expect(
        signUp("Test", "test@example.com", "password123")
      ).rejects.toThrow("Email address already used.");
    });
  });

  describe("login", () => {
    it("should return user and token when credentials are correct", async () => {
      const plainPassword = "password123";
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockUser = {
        id: 1,
        name: "Test",
        email: "test@example.com",
        password: hashedPassword,
        createdAt: new Date(),
        userType: "user",
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await login("test@example.com", plainPassword);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBeDefined();
    });

    it("should throw authentication error for invalid credentials", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(login("wrong@example.com", "password123")).rejects.toThrow(
        "Invalid credentials."
      );
    });
  });
});
