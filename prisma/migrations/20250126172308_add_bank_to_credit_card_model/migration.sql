/*
  Warnings:

  - Added the required column `bank` to the `credit_cards` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Banks" AS ENUM ('BRADESCO', 'ITAU', 'CAIXA_ECONOMICA', 'SANTANDER', 'BANCO_DO_BRASIL', 'HSBC', 'BANRISUL', 'BNB', 'BTG_PACTUAL', 'ORIGINAL', 'INTER', 'PAN');

-- AlterTable
ALTER TABLE "credit_cards" ADD COLUMN     "bank" "Banks" NOT NULL;
