"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { CreditCardType, CreditCardStatus, Banks } from "@prisma/client";
import { upsertCreditCardSchema } from "./schema";
import { cardTypeToFilename } from "@/app/_utils/card-type-to-filename";

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

  const imagePath = cardTypeToFilename(params.type);
  const { id, ...rest } = params;

  if (!id) {
    return await prisma.creditCard.create({
      data: {
        ...rest,
        imagePath,
        userId,
      },
    });
  }

  return await prisma.creditCard.update({
    where: { id },
    data: {
      ...rest,
      imagePath,
      userId,
    },
  });
};
