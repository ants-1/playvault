import { signUp, login, googleCallback, guestLogin } from "../../services/authService";
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

jest.mock("../../utils/generateToken", () => ({
  generateToken: jest.fn(() => "mock-token"),
}));

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.GUEST_EMAIL;
    delete process.env.GUEST_PASSWORD;
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

    it("should throw NotFoundError on P2025/P2021", async () => {
      const error = { code: "P2025" };
      (prisma.user.create as jest.Mock).mockRejectedValue(error);

      await expect(signUp("Test", "test@example.com", "password123")).rejects.toThrow(
        "User was not registered."
      );
    });

    it("should throw generic error on unknown error", async () => {
      const error = { code: "UNKNOWN" };
      (prisma.user.create as jest.Mock).mockRejectedValue(error);

      await expect(signUp("Test", "test@example.com", "password123")).rejects.toThrow(
        "Failed to register user."
      );
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

    it("should throw authentication error for invalid email", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(login("wrong@example.com", "password123")).rejects.toThrow(
        "Invalid credentials."
      );
    });

    it("should throw authentication error for invalid password", async () => {
      const hashedPassword = await bcrypt.hash("correctPassword", 10);
      const mockUser = { id: 1, email: "test@example.com", password: hashedPassword };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      await expect(login("test@example.com", "wrongPassword")).rejects.toThrow(
        "Invalid passowrd."
      );
    });
  });

  describe("googleCallback", () => {
    it("should create a new user if not exists", async () => {
      const profile = { emails: [{ value: "new@example.com" }], displayName: "New User" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "New User",
        email: "new@example.com",
      });

      const result = await googleCallback(profile);
      expect(result.user.name).toBe("New User");
      expect(result.token).toBeDefined();
    });

    it("should return existing user if exists", async () => {
      const profile = { emails: [{ value: "existing@example.com" }], displayName: "Existing" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        name: "Existing",
        email: "existing@example.com",
      });

      const result = await googleCallback(profile);
      expect(result.user.name).toBe("Existing");
      expect(result.token).toBeDefined();
    });

    it("should throw error if no email", async () => {
      const profile = { emails: [], displayName: "NoEmail" };
      await expect(googleCallback(profile)).rejects.toThrow("No email found in Google profile");
    });
  });

  describe("guestLogin", () => {
    beforeEach(() => {
      process.env.GUEST_EMAIL = "guest@example.com";
      process.env.GUEST_PASSWORD = "guestpass";
    });

    it("should create new guest user if not exists", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Guest User",
        email: "guest@example.com",
      });

      const result = await guestLogin();
      expect(result.user.name).toBe("Guest User");
      expect(result.token).toBeDefined();
    });

    it("should return existing guest user if password matches", async () => {
      const hashedPassword = await bcrypt.hash("guestpass", 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        name: "Guest User",
        email: "guest@example.com",
        password: hashedPassword,
      });

      const result = await guestLogin();
      expect(result.user.name).toBe("Guest User");
      expect(result.token).toBeDefined();
    });

    it("should throw AuthenticationError if password does not match", async () => {
      const hashedPassword = await bcrypt.hash("otherpass", 10);
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        name: "Guest User",
        email: "guest@example.com",
        password: hashedPassword,
      });

      await expect(guestLogin()).rejects.toThrow("Invalid passowrd.");
    });

    it("should throw error if guest credentials missing", async () => {
      delete process.env.GUEST_EMAIL;
      delete process.env.GUEST_PASSWORD;

      await expect(guestLogin()).rejects.toThrow("Guest credentials not configured.");
    });
  });
});
