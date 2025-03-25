"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import type { TransactionType } from "@prisma/client";

interface UpsertCategoryParams {
  id?: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

export const upsertCategory = async ({
  name,
  id,
  color,
  icon,
  type,
}: UpsertCategoryParams) => {
  const { userId } = await auth();

  if (!userId || !color || !icon) {
    throw new Error("Error");
  }

  if (!id) {
    return await prisma.category.create({
      data: {
        name,
        userId,
        color,
        icon,
        type,
      },
    });
  }

  return await prisma.category.update({
    where: { id },
    data: {
      name,
    },
  });
};
