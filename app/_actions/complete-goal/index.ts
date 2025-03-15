"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

interface CompleteGoalParams {
  id?: string;
}

export const completeGoal = async ({ id }: CompleteGoalParams) => {
  const goal = await prisma.goal.findUnique({
    where: {
      id,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  return await prisma.goal.update({
    where: {
      id,
    },
    data: {
      status: "COMPLETED",
      currentAmount: goal?.goalAmount,
    },
  });
};
