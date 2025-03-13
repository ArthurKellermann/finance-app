-- CreateTable
CREATE TABLE "goal_deposit" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_deposit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "goal_deposit" ADD CONSTRAINT "goal_deposit_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "goals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
