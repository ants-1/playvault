import { Request, Response } from "express";
import * as productService from "../services/productService";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts();

    return res.status(200).json({ products });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    const product = await productService.getProduct(id);

    res.status(200).json({ product });
  } catch (error: any) {
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

    const result = await productService.addProduct(
      name,
      description,
      quantity,
      price,
      thumbnail,
      images,
      categoryId
    );

    res.status(201).json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

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

    const updatedProduct = await productService.updateProduct(
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
      product: updatedProduct,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid product ID." });
    }

    await productService.deleteProduct(id);

    res.status(200).json({
      message: "Product deleted.",
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
