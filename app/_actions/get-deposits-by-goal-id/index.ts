"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export const getDepositsByGoalId = async (goalId: string) => {
  const deposits = await prisma.goalDeposit.findMany({
    where: {
      goalId,
    },
  });

  return deposits;
};
