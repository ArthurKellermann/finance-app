"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export const deleteDeposit = async ({ depositId }: { depositId: string }) => {
  const deposit = await prisma.goalDeposit.delete({
    where: {
      id: depositId,
    },
  });

  await prisma.goal.update({
    where: {
      id: deposit.goalId,
    },
    data: {
      currentAmount: {
        decrement: deposit.amount,
      },
    },
  });
};
