-- CreateEnum
CREATE TYPE "RecurrenceType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ScheduledTransactionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "scheduledTransactionId" TEXT;

-- CreateTable
CREATE TABLE "ScheduledTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subCategoryId" TEXT,
    "paymentMethod" "TransactionPaymentMethod" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrenceType" "RecurrenceType",
    "recurrenceInterval" INTEGER,
    "creditCardId" TEXT,
    "description" TEXT,
    "status" "ScheduledTransactionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastExecutionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledTransaction_userId_idx" ON "ScheduledTransaction"("userId");

-- CreateIndex
CREATE INDEX "ScheduledTransaction_categoryId_idx" ON "ScheduledTransaction"("categoryId");

-- CreateIndex
CREATE INDEX "ScheduledTransaction_startDate_idx" ON "ScheduledTransaction"("startDate");

-- CreateIndex
CREATE INDEX "ScheduledTransaction_status_idx" ON "ScheduledTransaction"("status");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_scheduledTransactionId_fkey" FOREIGN KEY ("scheduledTransactionId") REFERENCES "ScheduledTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTransaction" ADD CONSTRAINT "ScheduledTransaction_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
