import { NextResponse } from "next/server";
import { prisma } from "@/app/_lib/_prisma/prisma";
import { RecurrenceType, ScheduledTransactionStatus } from "@prisma/client";

function isVercelCronRequest(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (process.env.CRON_SECRET) {
    return authHeader === `Bearer ${process.env.CRON_SECRET}`;
  }

  const cronHeader = request.headers.get("x-vercel-cron");
  return Boolean(cronHeader);
}

export async function GET(request: Request) {
  try {
    if (
      process.env.NODE_ENV === "production" &&
      !isVercelCronRequest(request)
    ) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await processScheduledTransactions();

    return NextResponse.json({
      success: true,
      processed: result.processed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error executing scheduled transactions cron job:", error);
    return NextResponse.json(
      {
        error: "Failed to process scheduled transactions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

async function processScheduledTransactions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduledTransactions = await prisma.scheduledTransaction.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        {
          isRecurring: false,
          startDate: {
            lte: today,
          },
          lastExecutionDate: null,
        },
        {
          isRecurring: true,
          startDate: {
            lte: today,
          },
          endDate: {
            gte: today,
          },
        },
        {
          isRecurring: true,
          startDate: {
            lte: today,
          },
          endDate: null,
        },
      ],
    },
  });

  let processedCount = 0;

  for (const transaction of scheduledTransactions) {
    if (transaction.isRecurring && transaction.lastExecutionDate) {
      const lastExecution = new Date(transaction.lastExecutionDate);
      const shouldExecute = shouldExecuteToday(
        lastExecution,
        today,
        transaction.recurrenceType!,
        transaction.recurrenceInterval!,
      );

      if (!shouldExecute) {
        continue;
      }
    }

    await prisma.transaction.create({
      data: {
        userId: transaction.userId,
        name: transaction.name,
        amount: transaction.amount,
        type: transaction.type,
        categoryId: transaction.categoryId,
        subCategoryId: transaction.subCategoryId,
        paymentMethod: transaction.paymentMethod,
        date: new Date(),
        creditCardId: transaction.creditCardId,
        scheduledTransactionId: transaction.id,
      },
    });

    await prisma.scheduledTransaction.update({
      where: { id: transaction.id },
      data: { lastExecutionDate: new Date() },
    });

    if (!transaction.isRecurring) {
      await prisma.scheduledTransaction.update({
        where: { id: transaction.id },
        data: { status: "COMPLETED" as ScheduledTransactionStatus },
      });
    }

    if (transaction.isRecurring && transaction.endDate) {
      const endDate = new Date(transaction.endDate);
      if (today >= endDate) {
        await prisma.scheduledTransaction.update({
          where: { id: transaction.id },
          data: { status: "COMPLETED" as ScheduledTransactionStatus },
        });
      }
    }

    processedCount++;
  }

  return { processed: processedCount };
}

function shouldExecuteToday(
  lastExecution: Date,
  today: Date,
  recurrenceType: RecurrenceType,
  interval: number,
): boolean {
  lastExecution.setHours(0, 0, 0, 0);

  if (lastExecution.getTime() === today.getTime()) {
    return false;
  }

  switch (recurrenceType) {
    case "DAILY":
      const diffDays = Math.floor(
        (today.getTime() - lastExecution.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays >= interval && diffDays % interval === 0;

    case "WEEKLY":
      const diffWeeks = Math.floor(
        (today.getTime() - lastExecution.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      return diffWeeks >= interval && diffWeeks % interval === 0;

    case "MONTHLY":
      const lastMonth = lastExecution.getMonth();
      const todayMonth = today.getMonth();
      const lastYear = lastExecution.getFullYear();
      const todayYear = today.getFullYear();

      const monthsDiff = (todayYear - lastYear) * 12 + (todayMonth - lastMonth);

      return (
        today.getDate() === lastExecution.getDate() &&
        monthsDiff >= interval &&
        monthsDiff % interval === 0
      );

    case "YEARLY":
      const diffYears = today.getFullYear() - lastExecution.getFullYear();
      return (
        today.getDate() === lastExecution.getDate() &&
        today.getMonth() === lastExecution.getMonth() &&
        diffYears >= interval &&
        diffYears % interval === 0
      );

    default:
      return false;
  }
}
