"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export const findCategoryByName = async ({
  userId,
  name,
}: {
  userId: string;
  name: string;
}) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        userId: userId,
        name: name,
      },
    });
    return category;
  } catch (error) {
    console.error("Error finding category:", error);
    throw new Error("Error finding category");
  }
};
