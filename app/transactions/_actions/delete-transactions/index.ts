"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";

export const deleteTransactions = async (ids: string[]) => {
  try {
    await prisma.transaction.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
