"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { TransactionPaymentMethod, TransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface UpsertTransactionParams {
  id?: string;
  name: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  paymentMethod: TransactionPaymentMethod;
  date: Date;
  creditCardId?: string;
}

export const upsertTransaction = async (params: UpsertTransactionParams) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const transaction = await prisma.transaction.upsert({
      where: { id: params.id ?? "" },
      create: { ...params, userId },
      update: { ...params, userId },
    });

    if (
      params.paymentMethod === TransactionPaymentMethod.CREDIT_CARD &&
      params.creditCardId
    ) {
      await prisma.creditCard.update({
        where: { id: params.creditCardId },
        data: {
          spent: {
            increment: params.amount,
          },
        },
      });
    }

    revalidatePath("/transactions");
    return transaction;
  } catch (error) {
    console.error("Error upserting transaction:", error);
    throw new Error("Failed to upsert transaction");
  }
};
