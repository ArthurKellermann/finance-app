import { CalendarClock } from "lucide-react";
import AddScheduledTransactionButton from "./_components/add-scheduled-transaction-button";
import { prisma } from "../_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { DataTable } from "./_columns/data-table/data-table";
import { columns } from "./_columns/data-table/columns";

const ScheduleTransaction = async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const scheduledTransactions = await prisma.scheduledTransaction.findMany({
    where: { userId },
    orderBy: { startDate: "desc" },
    include: { category: true },
  });
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <CalendarClock className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Programar Transação</h1>
                <p className="text-sm">
                  Programe transações recorrentes para facilitar seu dia-a-dia
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AddScheduledTransactionButton userCanAddTransaction />
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={JSON.parse(JSON.stringify(scheduledTransactions))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ScheduleTransaction;
