"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionPaymentMethod } from "@prisma/client";

const getTransactionsByPaymentMethod = async (
  paymentMethod: TransactionPaymentMethod,
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      paymentMethod,
      userId,
      type: "EXPENSE",
      creditCardId: {
        not: null,
      },
    },
    include: {
      creditCard: true,
      category: true,
    },
  });

  return { transactions };
};

export default getTransactionsByPaymentMethod;
