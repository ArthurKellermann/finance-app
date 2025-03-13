/*
  Warnings:

  - You are about to drop the column `iconPath` on the `goals` table. All the data in the column will be lost.
  - You are about to drop the column `startingAmount` on the `goals` table. All the data in the column will be lost.
  - Added the required column `currentAmount` to the `goals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `goals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "goals" DROP COLUMN "iconPath",
DROP COLUMN "startingAmount",
ADD COLUMN     "currentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;
