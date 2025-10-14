import { prisma } from "../lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      include: { products: true },
    });

    return categories;
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories.");
  }
};

export const getCategory = async (id: number) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  } catch (error: any) {
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
    const newCategory = await prisma.category.create({
      data: {
        name,
        description,
        thumbnail,
      },
    });

    return newCategory;
  } catch (error: any) {
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
    const updateCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        thumbnail,
      },
    });

    return updateCategory;
  } catch (error: any) {
    console.error("Failed to update category:", error);
    throw new Error("Failed to update category.");
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    return deletedCategory;
  } catch (error: any) {
    console.error("Failed to delete category:", error);
    throw new Error("Failed to delete category.");
  }
};
