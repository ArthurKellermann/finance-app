import { prisma } from "@/app/_lib/_prisma/prisma";
import { TransactionType } from "@prisma/client";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";
import { auth } from "@clerk/nextjs/server";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const where = {
    userId,
    date: {
      gte: new Date(`2025-${month}-01`),
      lt: new Date(`2025-${month}-31`),
    },
  };

  const depositsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const investmentsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const expensesTotal = Number(
    (
      await prisma.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );

  const balance = depositsTotal - investmentsTotal - expensesTotal;

  const transactionsTotal = Number(
    (
      await prisma.transaction.aggregate({
        where,
        _sum: { amount: true },
      })
    )._sum.amount,
  );

  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]: Math.round(
      (Number(depositsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.EXPENSE]: Math.round(
      (Number(expensesTotal || 0) / Number(transactionsTotal)) * 100,
    ),
    [TransactionType.INVESTMENT]: Math.round(
      (Number(investmentsTotal || 0) / Number(transactionsTotal)) * 100,
    ),
  };

  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.categoryId,
    totalAmount: Number(category._sum.amount),
    percentageOfTotal: Math.round(
      (Number(category._sum.amount) / Number(expensesTotal)) * 100,
    ),
  }));

  const categories = await prisma.category.findMany({
    where: { id: { in: totalExpensePerCategory.map((c) => c.category) } },
  });

  totalExpensePerCategory.forEach((item) => {
    const category = categories.find((c) => c.id === item.category);
    if (category) {
      item.category = category.name;
    }

    if (category?.color) {
      item.color = category.color;
    }

    if (category?.icon) {
      item.icon = category.icon;
    }
  });

  const lastTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });

  const creditCardTransactions = await prisma.transaction.groupBy({
    by: ["creditCardId"],
    where: {
      ...where,
      type: TransactionType.EXPENSE,
    },
    _sum: {
      amount: true,
    },
  });

  const totalSpentByCreditCardPerMonth = creditCardTransactions.reduce(
    (acc, card) => {
      acc[card.creditCardId as string] = Number(card._sum.amount);
      return acc;
    },
    {} as Record<string, number>,
  );

  const creditCards = await prisma.creditCard.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalCreditCardSpent = creditCards.reduce(
    (acc, card) => acc + card.spent,
    0,
  );

  const monthlyTransactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: "asc" },
  });

  const monthlyFlow = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    expenses: 0,
    revenue: 0,
    investment: 0,
  }));

  monthlyTransactions.forEach((transaction) => {
    const day = new Date(transaction.date).getDate();

    if (transaction.type === TransactionType.EXPENSE) {
      monthlyFlow[day - 1].expenses += Number(transaction.amount);
    } else if (transaction.type === TransactionType.DEPOSIT) {
      monthlyFlow[day - 1].revenue += Number(transaction.amount);
    } else if (transaction.type === TransactionType.INVESTMENT) {
      monthlyFlow[day - 1].investment += Number(transaction.amount);
    }
  });

  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    monthlyFlow,
    totalExpensePerCategory,
    totalCreditCardSpent,
    totalSpentByCreditCardPerMonth,
    creditCards,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};
