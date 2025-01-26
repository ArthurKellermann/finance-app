/*
  Warnings:

  - Added the required column `userId` to the `credit_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_cards" ADD COLUMN     "userId" TEXT NOT NULL;
