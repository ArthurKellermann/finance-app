"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";

interface GetCreditCardProps {
  userId: string;
}

const getCreditCards = async ({ userId }: GetCreditCardProps) => {
  try {
    const creditCards = await prisma.creditCard.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });

    return creditCards;
  } catch (error) {
    console.error("Error fetching credit cards:", error);
    throw new Error("Failed to fetch credit cards");
  }
};

export default getCreditCards;
