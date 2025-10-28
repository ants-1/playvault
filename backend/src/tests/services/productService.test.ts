import * as productService from "../../services/productService";
import { prisma } from "../../lib/prisma";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Product Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getProducts", () => {
    it("should return products with pagination", async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([
        { id: 1, name: "Test" },
      ]);
      (prisma.product.count as jest.Mock).mockResolvedValue(1);

      const result = await productService.getProducts(1, 10);

      expect(result).toEqual({
        data: [{ id: 1, name: "Test" }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      });
      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(prisma.product.count).toHaveBeenCalled();
    });

    it("should throw error on database failure", async () => {
      (prisma.product.findMany as jest.Mock).mockRejectedValue(
        new Error("DB fail")
      );

      await expect(productService.getProducts()).rejects.toThrow(
        "Failed to fetch products."
      );
    });
  });

  describe("getProduct", () => {
    it("should return a product", async () => {
      (prisma.product.findUniqueOrThrow as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Test",
      });

      const result = await productService.getProduct(1);
      expect(result).toEqual({ id: 1, name: "Test" });
    });

    it("should throw NotFoundError if product not found", async () => {
      const error = { code: "P2025" };
      (prisma.product.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(productService.getProduct(999)).rejects.toThrow(
        "Product not found."
      );
    });
  });

  describe("addProduct", () => {
    it("should create a new product", async () => {
      const mockProduct = { id: 1, name: "New" };
      (prisma.product.create as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.addProduct(
        "New",
        "desc",
        0,
        100,
        "thumb",
        [],
        1
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const updated = { id: 1, name: "Updated" };
      (prisma.product.update as jest.Mock).mockResolvedValue(updated);

      const result = await productService.updateProduct(1, "Updated");
      expect(result).toEqual(updated);
    });

    it("should throw NotFoundError if product not found", async () => {
      const error = { code: "P2025" };
      (prisma.product.update as jest.Mock).mockRejectedValue(error);

      await expect(productService.updateProduct(999, "X")).rejects.toThrow(
        "Product not found."
      );
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const deleted = { id: 1 };
      (prisma.product.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await productService.deleteProduct(1);
      expect(result).toEqual(deleted);
    });

    it("should throw NotFoundError if product not found", async () => {
      const error = { code: "P2025" };
      (prisma.product.delete as jest.Mock).mockRejectedValue(error);

      await expect(productService.deleteProduct(999)).rejects.toThrow(
        "Product not found."
      );
    });
  });
});
