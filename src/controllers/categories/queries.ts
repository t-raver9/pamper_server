import { Prisma, PrismaClient } from "@prisma/client";
import { EnhancedDbCategory } from "./types";

export const getAllCategories = (
  prismaClient: PrismaClient
): Prisma.PrismaPromise<EnhancedDbCategory[]> => {
  return prismaClient.category.findMany({
    select: {
      id: true,
      name: true,
      SubCategory: {
        select: {
          id: true,
          name: true,
          categoryId: true,
        },
      },
    },
  });
};
