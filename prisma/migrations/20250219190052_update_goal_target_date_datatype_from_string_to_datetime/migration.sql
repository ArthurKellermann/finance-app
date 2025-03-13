/*
  Warnings:

  - Changed the type of `targetDate` on the `goals` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "goals" DROP COLUMN "targetDate",
ADD COLUMN     "targetDate" TIMESTAMP(3) NOT NULL;
