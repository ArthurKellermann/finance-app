"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";

interface CreateGoalDepositProps {
  goalId: string;
  amount: number;
  date: Date;
}

const createGoalDeposit = async ({
  goalId,
  amount,
  date,
}: CreateGoalDepositProps) => {
  if (!goalId || !amount || !date) {
    throw new Error("Invalid data to create the deposit.");
  }
  if (amount <= 0) {
    throw new Error("The deposit amount must be positive.");
  }
  if (isNaN(date.getTime())) {
    throw new Error("The deposit date is invalid.");
  }

  try {
    const deposit = await prisma.$transaction(async (prisma) => {
      const deposit = await prisma.goalDeposit.create({
        data: {
          goalId,
          amount,
          date,
          createdAt: new Date(),
        },
      });

      const updatedGoal = await prisma.goal.update({
        where: { id: goalId },
        data: {
          currentAmount: {
            increment: amount,
          },
        },
      });

      if (updatedGoal.currentAmount >= updatedGoal.goalAmount) {
        await prisma.goal.update({
          where: { id: goalId },
          data: {
            status: "COMPLETED",
          },
        });
      }

      return deposit;
    });

    return deposit;
  } catch (error) {
    console.error("Error creating deposit:", error);
    throw new Error("Error creating deposit.");
  }
};

export default createGoalDeposit;
