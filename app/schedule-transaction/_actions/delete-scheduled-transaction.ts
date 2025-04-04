"use server";

import { prisma } from "@/app/_lib/_prisma/prisma";
import { revalidatePath } from "next/cache";

export const deleteScheduledTransaction = async (
  scheduledTransactionId: string,
) => {
  await prisma.scheduledTransaction.delete({
    where: {
      id: scheduledTransactionId,
    },
  });
  revalidatePath("/schedule-transactions");
  revalidatePath("/");
};
