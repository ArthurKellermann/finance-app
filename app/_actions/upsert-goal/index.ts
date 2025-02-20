"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoalStatus } from "@prisma/client";
import { upsertGoalSchema } from "./schema";

interface UpsertGoalParams {
  id?: string;
  name: string;
  description: string;
  status: GoalStatus;
  targetDate: Date;
  goalAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
}

export const upsertGoal = async (params: UpsertGoalParams) => {
  upsertGoalSchema.parse(params);

  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { id, ...rest } = params;

  if (!id) {
    return await prisma.goal.create({
      data: {
        ...rest,
        userId,
      },
    });
  }

  return await prisma.goal.update({
    where: { id },
    data: {
      ...rest,
      userId,
    },
  });
};
