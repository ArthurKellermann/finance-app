"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { CreateGoalSchema } from "./schema";

export const createGoal = async ({
  userId,
  name,
  description,
  status,
  targetDate,
  goalAmount,
  startingAmount,
  color,
  iconPath,
}: CreateGoalSchema): Promise<{ goalId: string }> => {
  if (
    !userId ||
    !name ||
    !color ||
    !iconPath ||
    !description ||
    !status ||
    !targetDate ||
    !goalAmount ||
    !startingAmount
  ) {
    throw new Error(
      "Missing required fields: userId, name, color, iconPath, description, status, targetDate, goalAmount, or startingAmount",
    );
  }

  try {
    const goal = await prisma.goal.create({
      data: {
        userId,
        name,
        description,
        status,
        targetDate,
        goalAmount,
        startingAmount,
        color,
        iconPath,
      },
    });

    console.log("Goal created successfully");

    return { goalId: goal.id };
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Error creating goal");
  }
};
