"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { CreateCategorySchema } from "./schema";

export const createCategory = async ({
  userId,
  name,
  isDefault,
  icon,
  color,
}: CreateCategorySchema): Promise<{ categoryId: string }> => {
  // Validação de entradas
  if (!userId || !name || !color || !icon) {
    throw new Error("Missing required fields: userId, name, color, or icon");
  }

  try {
    const category = await prisma.category.create({
      data: {
        userId,
        name,
        isDefault,
        icon,
        color,
      },
    });

    console.log("Category created successfully");

    return { categoryId: category.id };
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Error creating category");
  }
};
