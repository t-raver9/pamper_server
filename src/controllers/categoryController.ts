import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const rawCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        SubCategory: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Reshaping the data to change the key from 'SubCategory' to 'subCategories'
    const categories = rawCategories.map((category) => ({
      ...category,
      subCategories: category.SubCategory,
      SubCategory: undefined,
    }));

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};
