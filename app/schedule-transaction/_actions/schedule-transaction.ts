"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/app/_lib/_prisma/prisma";
import { revalidatePath } from "next/cache";
import {
  TransactionType,
  TransactionPaymentMethod,
  RecurrenceType,
} from "@prisma/client";

const scheduleTransactionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1),
  amount: z.number().positive(),
  type: z.nativeEnum(TransactionType),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().optional(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod),
  startDate: z.date(),
  endDate: z.date().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceType: z.nativeEnum(RecurrenceType).optional(),
  recurrenceInterval: z.number().positive().optional(),
  creditCardId: z.string().uuid().optional(),
  description: z.string().optional(),
});

export type ScheduleTransactionInput = z.infer<
  typeof scheduleTransactionSchema
>;

export async function scheduleTransaction(input: ScheduleTransactionInput) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const validatedData = scheduleTransactionSchema.parse(input);

    if (
      validatedData.isRecurring &&
      (!validatedData.recurrenceType || !validatedData.recurrenceInterval)
    ) {
      throw new Error(
        "Recurrence type and interval are required for recurring transactions",
      );
    }

    if (validatedData.paymentMethod === TransactionPaymentMethod.CREDIT_CARD) {
      if (validatedData.type !== TransactionType.EXPENSE) {
        throw new Error("Credit card can only be used for expenses");
      }
      if (!validatedData.creditCardId) {
        throw new Error("Credit card ID is required for credit card payments");
      }
    }

    const scheduledTransaction = await prisma.scheduledTransaction.upsert({
      where: {
        id: validatedData.id || "00000000-0000-0000-0000-000000000000",
      },
      update: {
        name: validatedData.name,
        amount: validatedData.amount,
        type: validatedData.type,
        categoryId: validatedData.categoryId,
        subCategoryId: validatedData.subCategoryId,
        paymentMethod: validatedData.paymentMethod,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        isRecurring: validatedData.isRecurring,
        recurrenceType: validatedData.isRecurring
          ? validatedData.recurrenceType
          : null,
        recurrenceInterval: validatedData.isRecurring
          ? validatedData.recurrenceInterval
          : null,
        creditCardId: validatedData.creditCardId,
        description: validatedData.description,
        updatedAt: new Date(),
      },
      create: {
        userId,
        name: validatedData.name,
        amount: validatedData.amount,
        type: validatedData.type,
        categoryId: validatedData.categoryId,
        subCategoryId: validatedData.subCategoryId,
        paymentMethod: validatedData.paymentMethod,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        isRecurring: validatedData.isRecurring,
        recurrenceType: validatedData.isRecurring
          ? validatedData.recurrenceType
          : null,
        recurrenceInterval: validatedData.isRecurring
          ? validatedData.recurrenceInterval
          : null,
        creditCardId: validatedData.creditCardId,
        description: validatedData.description,
        status: "ACTIVE",
        lastExecutionDate: null,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(validatedData.startDate);
    startDate.setHours(0, 0, 0, 0);

    if (startDate.getTime() <= today.getTime()) {
      await prisma.transaction.create({
        data: {
          userId,
          name: validatedData.name,
          amount: validatedData.amount,
          type: validatedData.type,
          categoryId: validatedData.categoryId,
          subCategoryId: validatedData.subCategoryId,
          paymentMethod: validatedData.paymentMethod,
          date: new Date(),
          creditCardId: validatedData.creditCardId,

          scheduledTransactionId: scheduledTransaction.id,
        },
      });

      await prisma.scheduledTransaction.update({
        where: { id: scheduledTransaction.id },
        data: { lastExecutionDate: new Date() },
      });
    }

    revalidatePath("/transactions");
    revalidatePath("/scheduled-transactions");

    return scheduledTransaction;
  } catch (error) {
    console.error("Error scheduling transaction:", error);
    throw error;
  }
}
