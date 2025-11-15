import request from "supertest";
import express, { json } from "express";
import * as categoryService from "../../services/categoryService";
import categoryRoutes from "../../routes/categoryRoutes";
import * as uploadUtil from "../../utils/uploadToCloudinary";

jest.mock("../../services/categoryService");
jest.mock("../../utils/uploadToCloudinary");

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

    it("should return 400 if ID is invalid", async () => {
      const response = await request(app).get("/api/categories/abc");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid category ID." });
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

    it("should call uploadToCloudinary if file provided", async () => {
      const newCat = { id: 1, name: "New", description: "Desc", thumbnail: "url" };
      (categoryService.addCategory as jest.Mock).mockResolvedValue(newCat);
      (uploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue("url");

      const response = await request(app)
        .post("/api/categories")
        .attach("thumbnail", Buffer.from("fake"), "thumb.png")
        .field("name", "New")
        .field("description", "Desc");

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: "Category successfully created.",
        data: newCat,
      });
      expect(uploadUtil.uploadToCloudinary).toHaveBeenCalled();
    });

    it("should return 400 if service returns null", async () => {
      (categoryService.addCategory as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/categories")
        .send({ name: "New", description: "Desc" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Error occured while creating category.",
      });
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

    it("should return 400 if ID is invalid", async () => {
      const response = await request(app).put("/api/categories/abc").send({});
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid category ID." });
    });

    it("should call uploadToCloudinary if file provided", async () => {
      const updatedCat = { id: 1, name: "Updated" };
      (categoryService.updateCategory as jest.Mock).mockResolvedValue(updatedCat);
      (uploadUtil.uploadToCloudinary as jest.Mock).mockResolvedValue("url");

      const response = await request(app)
        .put("/api/categories/1")
        .attach("thumbnail", Buffer.from("fake"), "thumb.png")
        .field("name", "Updated");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Category successfully updated.",
        data: updatedCat,
      });
      expect(uploadUtil.uploadToCloudinary).toHaveBeenCalled();
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

    it("should return 400 if ID is invalid", async () => {
      const response = await request(app).delete("/api/categories/abc");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid category ID." });
    });
  });
});
