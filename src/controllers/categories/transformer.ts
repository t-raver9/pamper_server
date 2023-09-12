import { Category, SubCategory } from "@prisma/client";
import { CategoryDTO, EnhancedDbCategory, SubCategoryDTO } from "./types";

export const enhancedDbCategoryToCatgeroyDto = (
  enhancedDbCategory: EnhancedDbCategory
): CategoryDTO => {
  const subCategoryDtos =
    enhancedDbCategory.SubCategory.map(dbSubCategoryToDto);

  const categoryDto: CategoryDTO = {
    id: enhancedDbCategory.id,
    name: enhancedDbCategory.name,
    subCategories: subCategoryDtos,
  };

  return categoryDto;
};

const dbSubCategoryToDto = (dbSubCategory: SubCategory): SubCategoryDTO => {
  const subCategoryDto: SubCategoryDTO = {
    id: dbSubCategory.id,
    name: dbSubCategory.name,
    categoryId: dbSubCategory.categoryId,
  };

  return subCategoryDto;
};
