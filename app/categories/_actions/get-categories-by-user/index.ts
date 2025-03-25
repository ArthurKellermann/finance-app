"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export async function getCategoriesByUser(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  return categories;
}
