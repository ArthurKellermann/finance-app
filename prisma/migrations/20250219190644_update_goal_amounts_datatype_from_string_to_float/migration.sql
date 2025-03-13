/*
  Warnings:

  - Changed the type of `goalAmount` on the `goals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `startingAmount` on the `goals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "goals" DROP COLUMN "goalAmount",
ADD COLUMN     "goalAmount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "startingAmount",
ADD COLUMN     "startingAmount" DOUBLE PRECISION NOT NULL;
