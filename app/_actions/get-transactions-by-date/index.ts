"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

export const getTransactionsByDate = async (date: Date) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: date,
        lt: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      category: true,
    },
  });

  return transactions;
};
