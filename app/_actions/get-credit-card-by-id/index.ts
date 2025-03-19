"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import type { CreditCard } from "@prisma/client";

export const getCreditCardById = async (id: string): Promise<CreditCard> => {
  const creditCard = await prisma.creditCard.findUnique({
    where: {
      id,
    },
  });

  if (!creditCard) {
    throw new Error("Credit card not found");
  }

  return creditCard;
};
