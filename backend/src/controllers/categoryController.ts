import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";
import { Category } from "../../generated/prisma";
import { Categories } from "../types/Category";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive." });
    }

    const categories: Categories = await categoryService.getCategories(
      page,
      limit
    );

    if (!categories) {
      return res.status(404).json({ message: "No categories found." });
    }

    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    const category: Category = await categoryService.getCategory(id);

    res.status(200).json({ data: category });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    let thumbnailUrl: string | null = "";

    if (req.files && (req.files as any).thumbnail) {
      const thumbFile = (req.files as any).thumbnail[0];
      thumbnailUrl = await uploadToCloudinary(thumbFile.path);
    }

    const { name, description } = req.body;

    const newCategory: Category = await categoryService.addCategory(
      name,
      description,
      thumbnailUrl
    );

    if (!newCategory) {
      return res
        .status(400)
        .json({ error: "Error occured while creating category." });
    }

    res
      .status(201)
      .json({ message: "Category successfully created.", data: newCategory });
  } catch (error: any) {
    if (error.name === "ConflictError") {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid category ID." });
    }
    
    let thumbnailUrl: string | undefined;

    if (req.files && (req.files as any).thumbnail) {
      const thumbFile: any = (req.files as any).thumbnail[0];
      thumbnailUrl = await uploadToCloudinary(thumbFile.path);
    }

    const { name, description} = req.body;

    const updateCategory: Category = await categoryService.updateCategory(
      id,
      name,
      description,
      thumbnailUrl
    );

    res.status(200).json({
      message: "Category successfully updated.",
      data: updateCategory,
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    if (error.name === "ConflictError") {
      return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id);

    if (id == null) {
      return res.status(400).json({ error: "Invalid category ID." });
    }

    await categoryService.deleteCategory(id);

    res.status(200).json({
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    if (error.name === "NotFoundError") {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};
