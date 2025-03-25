"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const getDefaultCategories = async () => {
  const { userId } = auth();

  try {
    const defaultCategories = await prisma.category.findMany({
      where: {
        isDefault: true,
      },
    });

    const categoriesByUser = await prisma.category.findMany({
      where: {
        userId,
      },
    });

    return [...defaultCategories, ...categoriesByUser];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default getDefaultCategories;
