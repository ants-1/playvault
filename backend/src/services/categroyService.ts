import { Category } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export const getCategories = async (page: number = 1, limit: number = 10) => {
  try {
    const skip: number = (page - 1) * limit;

    const categories: Category[] = await prisma.category.findMany({
      skip,
      take: limit,
      include: { products: true },
      orderBy: { id: "asc" },
    });

    const total: number = await prisma.category.count();
    const totalPages: number = Math.ceil(total / limit);

    return {
      data: categories,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories.");
  }
};

export const getCategory = async (id: number) => {
  try {
    const category: Category = await prisma.category.findUniqueOrThrow({
      where: { id },
      include: { products: true },
    });

    return category;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Category not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to fetch category:", error);
    throw new Error("Failed to fetch category.");
  }
};

export const addCategory = async (
  name: string,
  description: string,
  thumbnail: string
) => {
  try {
    const newCategory: Category = await prisma.category.create({
      data: {
        name,
        description,
        thumbnail,
      },
    });

    return newCategory;
  } catch (error: any) {
    if (error.code === "P2002") {
      const conflictError: Error = new Error("Category name already exists.");
      conflictError.name = "ConflictError";
      throw conflictError;
    }

    console.error("Failed to add category:", error);
    throw new Error("Failed to add category.");
  }
};

export const updateCategory = async (
  id: number,
  name?: string,
  description?: string,
  thumbnail?: string
) => {
  try {
    const updateCategory: Category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        thumbnail,
      },
    });

    return updateCategory;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Category not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    if (error.code === "P2002") {
      const conflictError: Error = new Error("Category name already exists.");
      conflictError.name = "ConflictError";
      throw conflictError;
    }

    console.error("Failed to update category:", error);
    throw new Error("Failed to update category.");
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const deletedCategory: Category = await prisma.category.delete({
      where: { id },
    });

    return deletedCategory;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Category not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category.");
  }
};
