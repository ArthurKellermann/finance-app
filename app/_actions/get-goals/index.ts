"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";

const getGoals = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return goals;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw new Error("Failed to fetch credit cards");
  }
};

export default getGoals;
