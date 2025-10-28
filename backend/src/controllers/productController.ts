import { Request, Response } from "express";
import * as productService from "../services/productService";
import { Products } from "../types/Product";
import { Product } from "../../generated/prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const products: Products = await productService.getProducts(page, limit);

    if (!products) {
      return res.status(404).json({ message: "No products found." });
    }

    return res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    const product: Product = await productService.getProduct(id);

    res.status(200).json({ data: product });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      quantity,
      price,
      thumbnail,
      images,
      categoryId,
    } = req.body;

    const newProduct: Product = await productService.addProduct(
      name,
      description,
      quantity,
      price,
      thumbnail,
      images,
      categoryId
    );

    if (!newProduct) {
      return res
        .status(400)
        .json({ error: "Error occured while creating a new product." });
    }

    if (!newProduct)
      res
        .status(201)
        .json({ message: "Product successfully created.", data: newProduct });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    const {
      name,
      description,
      quantity,
      price,
      thumbnail,
      images,
      categoryId,
    } = req.body;

    const updatedProduct: Product = await productService.updateProduct(
      id,
      name,
      description,
      quantity,
      price,
      thumbnail,
      images,
      categoryId
    );

    res.status(200).json({
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    await productService.deleteProduct(id);

    res.status(200).json({
      message: "Product deleted.",
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};
