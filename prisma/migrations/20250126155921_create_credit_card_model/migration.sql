-- CreateEnum
CREATE TYPE "CreditCardType" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'AMERICAN_EXPRESS', 'HIPERCARD', 'OTHER');

-- CreateEnum
CREATE TYPE "CreditCardStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BLOCKED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "credit_cards" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "CreditCardStatus" NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "type" "CreditCardType" NOT NULL,
    "statementCloseDay" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("id")
);
