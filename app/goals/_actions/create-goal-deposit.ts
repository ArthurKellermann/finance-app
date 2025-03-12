import { prisma } from "@/app/_lib/_prisma/prisma";

interface createGoalDepositProps {
  goalId: string;
  amount: number;
  date: Date;
}

const createGoalDeposit = async ({
  goalId,
  amount,
  date,
}: createGoalDepositProps) => {
  if (!goalId || !amount || !date) {
    return;
  }

  const deposit = await prisma.goalDeposit.create({
    data: {
      goalId,
      amount,
      date,
      createdAt: new Date(),
    },
  });

  return deposit;
};

export default createGoalDeposit;
