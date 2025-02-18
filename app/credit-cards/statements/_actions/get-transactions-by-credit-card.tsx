"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

const getTransactionsByCreditCard = async (creditCardId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      creditCardId: creditCardId,
    },
  });

  return { transactions };
};

export default getTransactionsByCreditCard;
