"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

interface UpsertSubCategoryParams {
  id?: string;
  categoryId?: string;
  name: string;
}

export const upsertSubCategory = async ({
  categoryId,
  name,
  id,
}: UpsertSubCategoryParams) => {
  const { userId } = await auth();

  if (!userId || !categoryId) {
    throw new Error("Error");
  }

  if (!id) {
    return await prisma.subCategory.create({
      data: {
        categoryId,
        name,
        userId,
      },
    });
  }

  return await prisma.subCategory.update({
    where: { id },
    data: {
      name,
    },
  });
};
