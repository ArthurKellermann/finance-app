"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

const getDefaultCategories = async () => {
  const defaultCategories = await prisma.category.findMany({
    where: {
      userId: null,
      isDefault: true,
    },
  });

  if (!defaultCategories || defaultCategories.length === 0) {
    return null;
  }

  const categories = defaultCategories.map((category) => ({
    value: category.name,
    categoryId: category.id,
  }));

  return categories;
};

export default getDefaultCategories;
