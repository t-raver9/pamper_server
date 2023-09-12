import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { EnhancedDbCategory } from "./types";
import { getAllCategories } from "./queries";
import { enhancedDbCategoryToCatgeroyDto } from "./transformer";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const dbCategories: EnhancedDbCategory[] = await getAllCategories(prisma);
    const categoryDtos = dbCategories.map(enhancedDbCategoryToCatgeroyDto);
    res.status(200).json(categoryDtos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};
