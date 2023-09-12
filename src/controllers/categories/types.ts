import {
  Category as DbCategory,
  SubCategory as DbSubCategory,
} from "@prisma/client";

export type CategoryDTO = {
  id: number;
  name: string;
  subCategories: SubCategoryDTO[];
};

export type SubCategoryDTO = {
  id: number;
  name: string;
  categoryId: number;
};

export type EnhancedDbCategory = DbCategory & {
  SubCategory: DbSubCategory[];
};
