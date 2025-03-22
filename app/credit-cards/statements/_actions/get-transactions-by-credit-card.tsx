"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import type { Transaction } from "@prisma/client";

const getTransactionsByCreditCard = async (
  creditCardId: string,
): Promise<Transaction[]> => {
  const transactions = await prisma.transaction.findMany({
    where: {
      creditCardId: creditCardId,
    },
    include: {
      creditCard: true,
      category: true,
    },
  });

  return transactions;
};

export default getTransactionsByCreditCard;
