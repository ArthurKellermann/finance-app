"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { DeleteCreditCardSchema } from "./schema";

export const deleteCreditCard = async ({
  creditCardId,
}: DeleteCreditCardSchema) => {
  await prisma.creditCard.delete({
    where: {
      id: creditCardId,
    },
  });
};
