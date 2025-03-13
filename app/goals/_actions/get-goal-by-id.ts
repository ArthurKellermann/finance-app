"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const getGoalById = async (id: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const goal = await prisma.goal.findUnique({
      where: { userId, id },
    });

    return goal;
  } catch (error) {
    console.error("Error fetching goal:", error);
    throw new Error("Failed to fetch goal.");
  }
};

export default getGoalById;
