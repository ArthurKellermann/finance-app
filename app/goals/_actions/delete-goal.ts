"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export const deleteGoal = async ({ goalId }: { goalId: string }) => {
  await prisma.goal.delete({
    where: {
      id: goalId,
    },
  });
};
