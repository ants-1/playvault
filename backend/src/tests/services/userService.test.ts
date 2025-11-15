import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import * as userService from "../../services/userService";
import { User } from "../../../generated/prisma";
import dotenv from "dotenv";
dotenv.config();

jest.mock("../../lib/prisma", () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed-${password}`)),
  compare: jest.fn((password: string, hashed: string) =>
    Promise.resolve(hashed === `hashed-${password}`)
  ),
}));

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getUsers", () => {
    it("should return paginated users", async () => {
      const mockUsers = [{ id: 1, name: "John", email: "john@example.com" }];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers);
      (prisma.user.count as jest.Mock).mockResolvedValue(1);

      const result = await userService.getUsers(1, 10);

      expect(result).toEqual({
        data: mockUsers,
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
    });

    it("should throw error if no users found", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      await expect(userService.getUsers(1, 10)).rejects.toThrow(
        "Failed to fetch users."
      );
    });

    it("should throw error if findMany returns empty array and count returns 0", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.user.count as jest.Mock).mockResolvedValue(0);

      await expect(userService.getUsers(1, 10)).rejects.toThrow(
        "Failed to fetch users."
      );
    });
  });

  describe("getUser", () => {
    it("should return a user by id", async () => {
      const mockUser = { id: 1, name: "John", email: "john@example.com" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.getUser(1);

      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundError if user not found (P2025)", async () => {
      const error: any = { code: "P2025" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(userService.getUser(999)).rejects.toThrow("User not found.");
    });

    it("should throw NotFoundError if user not found (P2021)", async () => {
      const error: any = { code: "P2021" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(userService.getUser(999)).rejects.toThrow("User not found.");
    });

    it("should throw generic error if unexpected error occurs", async () => {
      const error: any = { code: "UNKNOWN" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(userService.getUser(1)).rejects.toThrow("Failed to fetch user");
    });
  });

  describe("updaterUser", () => {
    it("should update user successfully", async () => {
      const mockUser = {
        id: 1,
        name: "John Updated",
        email: "john@example.com",
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const result = await userService.updaterUser(
        1,
        "John Updated",
        "john@example.com"
      );

      expect(result).toEqual(mockUser);
    });

    it("should throw NotFoundError if user not found (P2025)", async () => {
      const error: any = { code: "P2025" };
      (prisma.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updaterUser(999, "Name", "email@test.com")
      ).rejects.toThrow("User not found.");
    });

    it("should throw NotFoundError if user not found (P2021)", async () => {
      const error: any = { code: "P2021" };
      (prisma.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updaterUser(999, "Name", "email@test.com")
      ).rejects.toThrow("User not found.");
    });

    it("should throw ConflictError if email exists", async () => {
      const error: any = { code: "P2002" };
      (prisma.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updaterUser(1, "Name", "existing@test.com")
      ).rejects.toThrow("User email already exists.");
    });

    it("should throw generic error if unexpected error occurs", async () => {
      const error: any = { code: "UNKNOWN" };
      (prisma.user.update as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updaterUser(1, "Name", "email@test.com")
      ).rejects.toThrow("Failed to update user");
    });
  });

  describe("updateUserPassword", () => {
    it("should update password successfully", async () => {
      const mockUser: User = {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "hashed-oldPass",
      } as User;

      (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-newPass");
      (prisma.user.update as jest.Mock).mockResolvedValue({});

      const result = await userService.updateUserPassword(
        1,
        "oldPass",
        "newPass"
      );

      expect(result).toEqual({ message: "Password updated successfully." });
    });

    it("should throw AuthenticationError if old password does not match", async () => {
      const mockUser: User = {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "hashed-oldPass",
      } as User;
      (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        userService.updateUserPassword(1, "wrongOldPass", "newPass")
      ).rejects.toThrow("Passwords do not match.");
    });

    it("should throw NotFoundError if user not found (P2025)", async () => {
      const error: any = { code: "P2025" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updateUserPassword(999, "oldPass", "newPass")
      ).rejects.toThrow("User not found.");
    });

    it("should throw NotFoundError if user not found (P2021)", async () => {
      const error: any = { code: "P2021" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updateUserPassword(999, "oldPass", "newPass")
      ).rejects.toThrow("User not found.");
    });

    it("should throw generic error if unexpected error occurs", async () => {
      const error: any = { code: "UNKNOWN" };
      (prisma.user.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(
        userService.updateUserPassword(1, "oldPass", "newPass")
      ).rejects.toThrow("Failed to update password.");
    });

    it("should throw error if bcrypt.compare fails unexpectedly", async () => {
      const mockUser: User = {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "hashed-oldPass",
      } as User;

      (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error("bcrypt fail"));

      await expect(
        userService.updateUserPassword(1, "oldPass", "newPass")
      ).rejects.toThrow("Failed to update password.");
    });

    it("should throw error if bcrypt.hash fails unexpectedly", async () => {
      const mockUser: User = {
        id: 1,
        name: "John",
        email: "john@example.com",
        password: "hashed-oldPass",
      } as User;

      (prisma.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error("hash fail"));

      await expect(
        userService.updateUserPassword(1, "oldPass", "newPass")
      ).rejects.toThrow("Failed to update password.");
    });
  });
});
