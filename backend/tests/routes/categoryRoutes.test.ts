import request from "supertest";
import express, { json } from "express";
import * as categoryService from "../../src/services/categoryService";
import categoryRoutes from "../../src/routes/categoryRoutes";

jest.mock("../../src/services/categoryService");

const app = express();
app.use(json());
app.use("/api/categories", categoryRoutes);

describe("Category Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/categories", () => {
    it("should return categories", async () => {
      const mockData = {
        data: [{ id: 1, name: "Cat" }],
        pagination: { page: 1, total: 1 },
      };
      (categoryService.getCategories as jest.Mock).mockResolvedValue(mockData);

      const response = await request(app).get(
        "/api/categories?page=1&limit=10"
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    it("should return 400 if invalid pagination", async () => {
      const response = await request(app).get("/api/categories?page=-1");
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/categories/:id", () => {
    it("should return single category", async () => {
      const mockCategory = { id: 1, name: "Food" };
      (categoryService.getCategory as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const response = await request(app).get("/api/categories/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockCategory });
    });

    it("should return 404 if NotFoundError", async () => {
      const error = new Error("Category not found.");
      error.name = "NotFoundError";
      (categoryService.getCategory as jest.Mock).mockRejectedValue(error);

      const response = await request(app).get("/api/categories/999");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Category not found." });
    });
  });

  describe("POST /api/categories", () => {
    it("should create new category", async () => {
      const newCat = { id: 1, name: "New", description: "Desc", thumbnail: "" };
      (categoryService.addCategory as jest.Mock).mockResolvedValue(newCat);

      const response = await request(app)
        .post("/api/categories")
        .send({ name: "New", description: "Desc", thumbnail: "" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Category successfully created.",
        data: newCat,
      });
    });

    it("should return 409 if name conflict", async () => {
      const error = new Error("Category name already exists.");
      error.name = "ConflictError";
      (categoryService.addCategory as jest.Mock).mockRejectedValue(error);

      const response = await request(app)
        .post("/api/categories")
        .send({ name: "Dup", description: "Desc", thumbnail: "" });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: "Category name already exists." });
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/api/categories")
        .send({ description: "Desc", thumbnail: "" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("PUT /api/categories/:id", () => {
    it("should update category", async () => {
      const updated = { id: 1, name: "Updated" };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(updated);

      const response = await request(app)
        .put("/api/categories/1")
        .send({ name: "Updated" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Category successfully updated.",
        data: updated,
      });
    });

    it("should return 404 if not found", async () => {
      const error = new Error("Category not found.");
      error.name = "NotFoundError";
      (categoryService.updateCategory as jest.Mock).mockRejectedValue(error);

      const response = await request(app)
        .put("/api/categories/999")
        .send({ name: "X" });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /api/categories/:id", () => {
    it("should delete category", async () => {
      (categoryService.deleteCategory as jest.Mock).mockResolvedValue(
        undefined
      );

      const response = await request(app).delete("/api/categories/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Category deleted successfully.",
      });
    });

    it("should return 404 if not found", async () => {
      const error = new Error("Category not found.");
      error.name = "NotFoundError";
      (categoryService.deleteCategory as jest.Mock).mockRejectedValue(error);

      const response = await request(app).delete("/api/categories/999");
      expect(response.status).toBe(404);
    });
  });
});
