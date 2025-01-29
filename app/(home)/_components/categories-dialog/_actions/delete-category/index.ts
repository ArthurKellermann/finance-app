"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { DeleteCategorySchema } from "./schema";
// import { revalidatePath } from "next/cache";

export const deleteCategory = async ({ categoryId }: DeleteCategorySchema) => {
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
  //   revalidatePath("/categorys");
  //   revalidatePath("/");
};
