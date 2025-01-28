"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const findCategoryById = async (id: string): Promise<string> => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const category = await prisma.category.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category.name;
};

export default findCategoryById;
