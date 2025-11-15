import { prisma } from "../../lib/prisma";
import * as categoryService from "../../services/categoryService";

jest.mock("../../lib/prisma", () => ({
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

  // ---------------- getCategories ----------------
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

    // Additional coverage for console.error on unknown DB error
    it("should log error and throw on unknown DB error", async () => {
      (prisma.category.findMany as jest.Mock).mockRejectedValue(
        new Error("Random DB error")
      );

      await expect(categoryService.getCategories(1, 10)).rejects.toThrow(
        "Failed to fetch categories."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch categories:",
        expect.any(Error)
      );
    });
  });

  // ---------------- getCategory ----------------
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

    // Unknown error code coverage
    it("should throw generic error on unknown prisma error code", async () => {
      const error = { code: "UNKNOWN" };
      (prisma.category.findUniqueOrThrow as jest.Mock).mockRejectedValue(error);

      await expect(categoryService.getCategory(1)).rejects.toThrow(
        "Failed to fetch category."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Failed to fetch category:",
        error
      );
    });
  });

  // ---------------- addCategory ----------------
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

    // Generic error coverage
    it("should throw generic error on unknown create error", async () => {
      (prisma.category.create as jest.Mock).mockRejectedValue(
        new Error("Random create error")
      );

      await expect(
        categoryService.addCategory("New", "desc", "img.png")
      ).rejects.toThrow("Failed to add category.");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to add category:",
        expect.any(Error)
      );
    });
  });

  // ---------------- updateCategory ----------------
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

    // Unknown error coverage
    it("should throw generic error on unknown update error", async () => {
      const error = { code: "UNKNOWN" };
      (prisma.category.update as jest.Mock).mockRejectedValue(error);

      await expect(
        categoryService.updateCategory(1, "Name", "desc", "img.png")
      ).rejects.toThrow("Failed to update category.");
      expect(console.error).toHaveBeenCalledWith(
        "Failed to update category:",
        error
      );
    });

    // Undefined optional params coverage
    it("should update category with undefined optional params", async () => {
      const updated = { id: 1, name: "Updated" };
      (prisma.category.update as jest.Mock).mockResolvedValue(updated);

      const result = await categoryService.updateCategory(1);
      expect(result).toEqual(updated);
    });
  });

  // ---------------- deleteCategory ----------------
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

    // Unknown error coverage
    it("should throw generic error on unknown delete error", async () => {
      const error = { code: "UNKNOWN" };
      (prisma.category.delete as jest.Mock).mockRejectedValue(error);

      await expect(categoryService.deleteCategory(1)).rejects.toThrow(
        "Failed to delete category."
      );
      expect(console.error).toHaveBeenCalledWith(
        "Failed to delete category:",
        error
      );
    });
  });
});
