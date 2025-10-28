import { prisma } from "../../src/lib/prisma";
import * as categoryService from "../../src/services/categoryService";

jest.mock("../../src/lib/prisma", () => ({
  prisma: {
    category: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("categoryService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  describe("getCategories", () => {
    it("should return categories with pagination", async () => {
      const mockCategories = [{ id: 1, name: "Test Category" }];
      (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);
      (prisma.category.count as jest.Mock).mockResolvedValue(1);

      const result = await categoryService.getCategories(1, 10);

      expect(result).toEqual({
        data: mockCategories,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it("should throw error on database failure", async () => {
      (prisma.category.findMany as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(categoryService.getCategories(1, 10)).rejects.toThrow(
        "Failed to fetch categories."
      );
    });
  });

  describe("getCategory", () => {
    it("should return a category by id", async () => {
      const mockCategory = { id: 1, name: "Food" };
      (prisma.category.findUniqueOrThrow as jest.Mock).mockResolvedValue(
        mockCategory
      );

      const result = await categoryService.getCategory(1);
      expect(result).toEqual(mockCategory);
    });

    it("should throw NotFoundError if category not found", async () => {
      const error = { code: "P2025" };
      (prisma.category.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(categoryService.getCategory(1)).rejects.toThrow(
        "Category not found."
      );
    });
  });

  describe("addCategory", () => {
    it("should create and return a new category", async () => {
      const mockCategory = { id: 1, name: "New Cat" };
      (prisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.addCategory(
        "New Cat",
        "desc",
        "img.png"
      );
      expect(result).toEqual(mockCategory);
    });

    it("should throw ConflictError if name already exists", async () => {
      const error = { code: "P2002" };
      (prisma.category.create as jest.Mock).mockRejectedValue(error);

      await expect(
        categoryService.addCategory("Duplicate", "desc", "img.png")
      ).rejects.toThrow("Category name already exists.");
    });
  });

  describe("updateCategory", () => {
    it("should update and return category", async () => {
      const updated = { id: 1, name: "Updated Cat" };
      (prisma.category.update as jest.Mock).mockResolvedValue(updated);

      const result = await categoryService.updateCategory(
        1,
        "Updated Cat",
        "desc",
        "img.png"
      );
      expect(result).toEqual(updated);
    });

    it("should throw NotFoundError if category does not exist", async () => {
      const error = { code: "P2025" };
      (prisma.category.update as jest.Mock).mockRejectedValue(error);

      await expect(
        categoryService.updateCategory(999, "X", "desc", "img.png")
      ).rejects.toThrow("Category not found.");
    });

    it("should throw ConflictError if name already exists", async () => {
      const error = { code: "P2002" };
      (prisma.category.update as jest.Mock).mockRejectedValue(error);

      await expect(
        categoryService.updateCategory(1, "Dup", "desc", "img.png")
      ).rejects.toThrow("Category name already exists.");
    });
  });

  describe("deleteCategory", () => {
    it("should delete and return category", async () => {
      const deleted = { id: 1, name: "Old Cat" };
      (prisma.category.delete as jest.Mock).mockResolvedValue(deleted);

      const result = await categoryService.deleteCategory(1);
      expect(result).toEqual(deleted);
    });

    it("should throw NotFoundError if category not found", async () => {
      const error = { code: "P2025" };
      (prisma.category.delete as jest.Mock).mockRejectedValue(error);

      await expect(categoryService.deleteCategory(999)).rejects.toThrow(
        "Category not found."
      );
    });
  });
});
