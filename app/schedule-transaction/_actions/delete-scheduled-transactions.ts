"use server";
import { prisma } from "@/app/_lib/_prisma/prisma";

export const deleteScheduledTransactions = async (ids: string[]) => {
  try {
    await prisma.scheduledTransaction.deleteMany({
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
