import { prisma } from "@/app/_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { endOfDay, startOfMonth } from "date-fns";
import { redirect } from "next/navigation";

const getCurrentMonthTransactions = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const currentMonthTransactions = await prisma.transaction.count({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth(new Date()),
        lt: endOfDay(new Date()),
      },
    },
  });

  return { currentMonthTransactions };
};

export default getCurrentMonthTransactions;
