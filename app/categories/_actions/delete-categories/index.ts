"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";

export const deleteCategories = async (ids: string[]) => {
  try {
    await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
