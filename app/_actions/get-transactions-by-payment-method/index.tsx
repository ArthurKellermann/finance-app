"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { TransactionPaymentMethod } from "@prisma/client";

const getTransactionsByPaymentMethod = async (
  paymentMethod: TransactionPaymentMethod,
) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      paymentMethod,
    },
  });

  return { transactions };
};

export default getTransactionsByPaymentMethod;
