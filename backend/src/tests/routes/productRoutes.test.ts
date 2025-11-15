import request from "supertest";
import express, { json } from "express";
import * as productService from "../../services/productService";
import productRoutes from "../../routes/productRoutes";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

jest.mock("../../services/productService");
jest.mock("../../utils/uploadToCloudinary");

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

    // COVERAGE: products null branch
    it("returns 404 if no products found", async () => {
      (productService.getProducts as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/api/products?page=1&limit=10");
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No products found.");
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

    it("returns 400 if ID is invalid", async () => {
      const res = await request(app).get("/api/products/NaN");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
    });

    // COVERAGE: ID = 0 branch
    it("returns 400 if ID is 0", async () => {
      const res = await request(app).get("/api/products/0");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
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

    it("handles missing files gracefully", async () => {
      (productService.addProduct as jest.Mock).mockResolvedValue({
        id: 2,
        name: "NoFiles",
      });

      const res = await request(app)
        .post("/api/products")
        .send({
          name: "NoFiles",
          description: "desc",
          quantity: 1,
          price: 50,
          categoryId: 1,
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toEqual({ id: 2, name: "NoFiles" });
    });

    it("handles unexpected errors", async () => {
      (productService.addProduct as jest.Mock).mockRejectedValue(
        new Error("Unexpected add error")
      );

      const res = await request(app)
        .post("/api/products")
        .send({
          name: "X",
          description: "desc",
          quantity: 1,
          price: 50,
          categoryId: 1,
        });

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Unexpected add error");
    });

    // COVERAGE: addProduct returns null
    it("returns 400 if addProduct returns null", async () => {
      (productService.addProduct as jest.Mock).mockResolvedValue(null);
      const res = await request(app).post("/api/products").send({
        name: "X",
        description: "desc",
        quantity: 1,
        price: 10,
        categoryId: 1,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        "Error occurred while creating a new product."
      );
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

    it("handles missing files gracefully", async () => {
      (productService.updateProduct as jest.Mock).mockResolvedValue({
        id: 2,
        name: "UpdatedNoFiles",
      });

      const res = await request(app)
        .put("/api/products/2")
        .send({ name: "UpdatedNoFiles" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("UpdatedNoFiles");
    });

    it("handles NaN ID", async () => {
      const res = await request(app).put("/api/products/NaN").send({ name: "X" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
    });

    // COVERAGE: id=null
    it("returns 400 if update ID is null", async () => {
      const res = await request(app).put("/api/products/null").send({ name: "X" });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
    });

    it("handles NotFoundError", async () => {
      const error = new Error("Product not found.");
      error.name = "NotFoundError";
      (productService.updateProduct as jest.Mock).mockRejectedValue(error);

      const res = await request(app).put("/api/products/999").send({ name: "X" });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Product not found.");
    });

    it("handles unexpected errors", async () => {
      (productService.updateProduct as jest.Mock).mockRejectedValue(
        new Error("Unexpected update error")
      );

      const res = await request(app).put("/api/products/1").send({ name: "X" });
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error.");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("deletes a product", async () => {
      (productService.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Product deleted.");
    });

    it("handles NaN ID", async () => {
      const res = await request(app).delete("/api/products/NaN");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
    });

    // COVERAGE: id=null branch
    it("returns 400 if delete ID is null", async () => {
      const res = await request(app).delete("/api/products/null");
      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid product ID.");
    });

    it("handles NotFoundError", async () => {
      const error = new Error("Product not found.");
      error.name = "NotFoundError";
      (productService.deleteProduct as jest.Mock).mockRejectedValue(error);

      const res = await request(app).delete("/api/products/999");
      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Product not found.");
    });

    it("handles unexpected errors", async () => {
      (productService.deleteProduct as jest.Mock).mockRejectedValue(
        new Error("Unexpected delete error")
      );

      const res = await request(app).delete("/api/products/1");
      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Internal server error.");
    });
  });
});
