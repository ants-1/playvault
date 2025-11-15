import request from "supertest";
import express, { json } from "express";
import userRoutes from "../../routes/userRoutes";
import * as userService from "../../services/userService";

jest.mock("../../services/userService");

jest.mock("../../middlewares/authenticateJWT", () => ({
  authenticateJWT: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/users", () => {
    it("should return users with pagination", async () => {
      const mockData = {
        data: [{ id: 1, name: "John", email: "john@example.com" }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      (userService.getUsers as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get("/api/users?page=1&limit=10");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
    });

    it("should return 500 if service throws", async () => {
      (userService.getUsers as jest.Mock).mockRejectedValue(new Error("Failed"));

      const res = await request(app).get("/api/users");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error." });
    });

    it("should return 400 if page or limit is <= 0", async () => {
      const res = await request(app).get("/api/users?page=0&limit=-5");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Page and limit must be positive." });
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user", async () => {
      const mockUser = { id: 1, name: "John", email: "john@example.com" };
      (userService.getUser as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get("/api/users/1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ data: mockUser });
    });

    it("should return 404 if NotFoundError", async () => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      (userService.getUser as jest.Mock).mockRejectedValue(error);

      const res = await request(app).get("/api/users/999");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });

    it("should return 400 if invalid user ID", async () => {
      const res = await request(app).get("/api/users/abc");
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid user ID." });
    });

    it("should return 500 for generic error", async () => {
      (userService.getUser as jest.Mock).mockRejectedValue(new Error("Oops"));

      const res = await request(app).get("/api/users/1");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error." });
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user successfully", async () => {
      const mockUser = { id: 1, name: "John Updated", email: "john@example.com" };
      (userService.updaterUser as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .put("/api/users/1")
        .send({ name: "John Updated", email: "john@example.com" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "User updated successfully", data: mockUser });
    });

    it("should return 404 if NotFoundError", async () => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      (userService.updaterUser as jest.Mock).mockRejectedValue(error);

      const res = await request(app)
        .put("/api/users/999")
        .send({ name: "Someone", email: "someone@example.com" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found" });
    });

    it("should return 409 if ConflictError", async () => {
      const error = new Error("Email already exists");
      error.name = "ConflictError";
      (userService.updaterUser as jest.Mock).mockRejectedValue(error);

      const res = await request(app)
        .put("/api/users/1")
        .send({ name: "John", email: "existing@example.com" });

      expect(res.status).toBe(409);
      expect(res.body).toEqual({ error: "Email already exists" });
    });

    it("should return 400 if invalid user ID", async () => {
      const res = await request(app)
        .put("/api/users/abc")
        .send({ name: "John", email: "john@example.com" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid user ID." });
    });

    it("should return 500 for generic error", async () => {
      (userService.updaterUser as jest.Mock).mockRejectedValue(new Error("Oops"));

      const res = await request(app)
        .put("/api/users/1")
        .send({ name: "John", email: "john@example.com" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error." });
    });
  });

  describe("PUT /api/users/:id/password", () => {
    it("should update user password successfully", async () => {
      const mockResponse = { message: "Password updated successfully." };
      (userService.updateUserPassword as jest.Mock).mockResolvedValue(mockResponse);

      const res = await request(app)
        .put("/api/users/1/password")
        .send({ oldPassword: "oldPass123", newPassword: "newPass456" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockResponse);
    });

    it("should return 401 if AuthenticationError", async () => {
      const error = new Error("Passwords do not match.");
      error.name = "AuthenticationError";
      (userService.updateUserPassword as jest.Mock).mockRejectedValue(error);

      const res = await request(app)
        .put("/api/users/1/password")
        .send({ oldPassword: "wrongOldPass", newPassword: "newPass456" });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: "Passwords do not match." });
    });

    it("should return 404 if NotFoundError", async () => {
      const error = new Error("User not found.");
      error.name = "NotFoundError";
      (userService.updateUserPassword as jest.Mock).mockRejectedValue(error);

      const res = await request(app)
        .put("/api/users/999/password")
        .send({ oldPassword: "oldPass123", newPassword: "newPass456" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: "User not found." });
    });

    it("should return 500 for generic error", async () => {
      (userService.updateUserPassword as jest.Mock).mockRejectedValue(new Error("Oops"));

      const res = await request(app)
        .put("/api/users/1/password")
        .send({ oldPassword: "oldPass123", newPassword: "newPass456" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Internal server error." });
    });

    it("should return 400 if invalid user ID", async () => {
      const res = await request(app)
        .put("/api/users/abc/password")
        .send({ oldPassword: "oldPass123", newPassword: "newPass456" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Invalid user ID." }); // controller currently returns 500 for NaN
    });
  });
});
