"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreditCardType, CreditCardStatus, Banks } from "@prisma/client";
import { upsertCreditCardSchema } from "./schema";
import { revalidatePath } from "next/cache";

interface UpsertCreditCardParams {
  id?: string;
  description: string;
  limit: number;
  bank: Banks;
  spent: number;
  type: CreditCardType;
  statementCloseDay: number;
  dueDay: number;
  status: CreditCardStatus;
}

export const upsertCreditCard = async (params: UpsertCreditCardParams) => {
  upsertCreditCardSchema.parse(params);

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.creditCard.upsert({
    update: { ...params, userId },
    create: { ...params, userId },
    where: {
      id: params?.id ?? "",
    },
  });

  revalidatePath("/credit-cards");
};
