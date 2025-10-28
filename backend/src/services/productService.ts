import { Product } from "../../generated/prisma";
import { prisma } from "../lib/prisma";

export const getProducts = async (page: number = 1, limit: number = 10) => {
  try {
    const skip: number = (page - 1) * limit;

    const products: Product[] = await prisma.product.findMany({
      skip,
      take: limit,
      include: { categories: true },
      orderBy: { id: "asc" },
    });

    const total: number = await prisma.product.count();
    const totalPages: number = Math.ceil(total / limit);

    return {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    throw new Error("Failed to fetch products.");
  }
};

export const getProduct = async (id: number) => {
  try {
    const product: Product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: { categories: true },
    });

    return product;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Product not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to fetch product:", error);
    throw new Error("Failed to fetch product.");
  }
};

export const addProduct = async (
  name: string,
  description: string,
  quantity: number = 0,
  price: number,
  thumbnail: string,
  images: string[],
  categoryId: number
) => {
  try {
    const newProduct: Product = await prisma.product.create({
      data: {
        name,
        description,
        quantity,
        price,
        thumbnail,
        images,
        categoryId,
      },
      include: { categories: true },
    });

    return newProduct;
  } catch (error: any) {
    console.error("Failed to add product:", error);
    throw new Error("Failed to add product.");
  }
};

export const updateProduct = async (
  id: number,
  name?: string,
  description?: string,
  quantity?: number,
  price?: number,
  thumbnail?: string,
  images?: string[],
  categoryId?: number
) => {
  try {
    const updatedProduct: Product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        quantity,
        price,
        thumbnail,
        images,
        categoryId,
      },
      include: { categories: true },
    });

    return updatedProduct;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Product not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to update product:", error);
    throw new Error("Failed to update product.");
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const deletedProduct: Product = await prisma.product.delete({
      where: { id },
    });

    return deletedProduct;
  } catch (error: any) {
    if (error.code == "P2025" || error.code == "P2021") {
      const notFoundError: Error = new Error("Product not found.");
      notFoundError.name = "NotFoundError";
      throw notFoundError;
    }

    console.error("Failed to delete product:", error);
    throw new Error("Failed to delete product.");
  }
};
