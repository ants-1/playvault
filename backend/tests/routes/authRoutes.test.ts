import request from "supertest";
import express, { json } from "express";
import * as authService from "../../src/services/authService";
import authRoutes from "../../src/routes/authRoutes";

jest.mock("../../src/services/authService");

const app = express();
app.use(json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should return 201 and user/token on successful signup", async () => {
      const mockUser = { id: 1, name: "Test", email: "test@example.com" };
      const mockToken = "mock-token";

      (authService.signUp as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

      const response = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test", email: "test@example.com", password: "password123" });

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

      const response = await request(app)
        .post("/api/auth/signup")
        .send({ name: "Test", email: "test@example.com", password: "password123" });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Email already exists" });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 and user/token on successful login", async () => {
      const mockUser = { id: 1, name: "Test", email: "test@example.com" };
      const mockToken = "mock-token";

      (authService.login as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

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
  });
});
