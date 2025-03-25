"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export async function deleteSubCategory(id: string) {
  if (!id) {
    throw new Error("Sub category id is required");
  }

  await prisma.subCategory.delete({
    where: {
      id,
    },
  });
}
