import request from "supertest";
import express, { json, Request, Response, NextFunction } from "express";
import * as authService from "../../services/authService";
import authRoutes from "../../routes/authRoutes";
import passport from "passport";

jest.mock("../../services/authService");
jest.mock("../../utils/generateToken", () => ({
  generateToken: jest.fn(() => "mock-token"),
}));

jest.mock("passport", () => ({
  authenticate: jest.fn((strategy: string, options: any, callback: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (strategy === "google") {
        callback(null, {
          id: 1,
          name: "Google User",
          email: "google@example.com",
        });
      }
    };
  }),
}));

const app = express();
app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.logout = (optionsOrCallback?: any, maybeCallback?: any) => {
    if (typeof optionsOrCallback === "function") optionsOrCallback();
    else if (typeof maybeCallback === "function") maybeCallback();
  };
  next();
});

app.use("/api/auth", authRoutes);

describe("Auth Routes and Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should return 201 and user/token on successful signup", async () => {
      const mockUser = { id: 1, name: "Test", email: "test@example.com" };
      const mockToken = "mock-token";
      (authService.signUp as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app).post("/api/auth/signup").send({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Sign-up successful",
        user: mockUser,
        token: mockToken,
      });
    });

    it("should return 409 if ConflictError is thrown", async () => {
      const error = new Error("Email already exists");
      error.name = "ConflictError";
      (authService.signUp as jest.Mock).mockRejectedValue(error);

      const response = await request(app).post("/api/auth/signup").send({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });

    it("should return 404 if NotFoundError is thrown", async () => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      (authService.signUp as jest.Mock).mockRejectedValue(error);

      const response = await request(app).post("/api/auth/signup").send({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });

    it("should return 500 on unknown error", async () => {
      const error = new Error("Unexpected error");
      (authService.signUp as jest.Mock).mockRejectedValue(error);

      const response = await request(app).post("/api/auth/signup").send({
        name: "Test",
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error." });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 and user/token on successful login", async () => {
      const mockUser = { id: 1, name: "Test", email: "test@example.com" };
      const mockToken = "mock-token";
      (authService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login successful",
        user: mockUser,
        token: mockToken,
      });
    });

    it("should return 401 if AuthenticationError is thrown", async () => {
      const error = new Error("Invalid credentials");
      error.name = "AuthenticationError";
      (authService.login as jest.Mock).mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "wrongpass" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid credentials" });
    });

    it("should return 500 on unknown error", async () => {
      const error = new Error("Unexpected login error");
      (authService.login as jest.Mock).mockRejectedValue(error);

      const response = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error." });
    });
  });

  describe("POST /api/auth/guest", () => {
    it("should return 200 and user/token on successful guest login", async () => {
      const mockUser = {
        id: 1,
        name: "Guest User",
        email: "guest@example.com",
      };
      const mockToken = "mock-token";
      (authService.guestLogin as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const response = await request(app).post("/api/auth/guest").send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Guest login successful",
        user: mockUser,
        token: mockToken,
      });
    });

    it("should return 401 if AuthenticationError is thrown", async () => {
      const error = new Error("Invalid guest credentials");
      error.name = "AuthenticationError";
      (authService.guestLogin as jest.Mock).mockRejectedValue(error);

      const response = await request(app).post("/api/auth/guest").send();

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "Invalid guest credentials" });
    });

    it("should return 500 on unknown guest login error", async () => {
      const error = new Error("Unknown guest error");
      (authService.guestLogin as jest.Mock).mockRejectedValue(error);

      const response = await request(app).post("/api/auth/guest").send();

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to login as guest." });
    });
  });

  describe("POST /api/auth/logout", () => {
    it("should return 200 and success message", async () => {
      const response = await request(app).post("/api/auth/logout").send();
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: "Logout successful.",
      });
    });
  });

  describe("GET /api/auth/google/callback", () => {
    it("should return 400 if Google auth fails", async () => {
      // Mock passport.authenticate to call callback with error and null user
      (passport.authenticate as jest.Mock).mockImplementation(
        (_strategy, _options, callback) => {
          return (req: any, res: any, next: any) => {
            callback(new Error("Google auth error"), null);
          };
        }
      );

      const res = await request(app).get("/api/auth/google/callback");

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Google authentication failed:" });
    });
  });
});
