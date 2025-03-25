"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getSubCategoriesByCategoryId(categoryId: string) {
  const { userId } = auth();

  if (!categoryId || !userId) {
    return [];
  }

  const subCategories = await prisma.subCategory.findMany({
    where: {
      categoryId,
      userId,
    },
  });

  return subCategories;
}
