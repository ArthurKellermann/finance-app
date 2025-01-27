/*
  Warnings:

  - Added the required column `spent` to the `credit_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_cards" ADD COLUMN     "spent" DOUBLE PRECISION NOT NULL;
