import request from "supertest";
import express, { json } from "express";
import * as productService from "../../services/productService";
import productRoutes from "../../routes/productRoutes";

jest.mock("../../services/productService");

const app = express();
app.use(json());
app.use("/api/products", productRoutes);

describe("Product Routes", () => {
  afterEach(() => jest.clearAllMocks());

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("GET /api/products", () => {
    it("returns products", async () => {
      (productService.getProducts as jest.Mock).mockResolvedValue({
        data: [{ id: 1, name: "Test" }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });

      const res = await request(app).get("/api/products?page=1&limit=10");
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it("returns 400 on invalid page/limit", async () => {
      const res = await request(app).get("/api/products?page=-1&limit=0");
      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/products/:id", () => {
    it("returns a product", async () => {
      (productService.getProduct as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Test",
      });

      const res = await request(app).get("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual({ id: 1, name: "Test" });
    });

    it("returns 404 if not found", async () => {
      const error = new Error("Product not found.");
      error.name = "NotFoundError";
      (productService.getProduct as jest.Mock).mockRejectedValue(error);

      const res = await request(app).get("/api/products/999");
      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/products", () => {
    it("creates a product", async () => {
      (productService.addProduct as jest.Mock).mockResolvedValue({
        id: 1,
        name: "New",
      });

      const res = await request(app)
        .post("/api/products")
        .send({
          name: "New",
          description: "desc",
          quantity: 10,
          price: 100,
          thumbnail: "t.jpg",
          images: [],
          categoryId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual({ id: 1, name: "New" });
    });
  });

  describe("PUT /api/products/:id", () => {
    it("updates a product", async () => {
      (productService.updateProduct as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Updated",
      });

      const res = await request(app)
        .put("/api/products/1")
        .send({ name: "Updated" });
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Updated");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("deletes a product", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product deleted.");
    });
  });
});
