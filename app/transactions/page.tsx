import { prisma } from "../_lib/_prisma/prisma";
import AddTransactionButton from "../_components/add-transaction-button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ScrollArea } from "../_components/ui/scroll-area";
import canUserAddTransaction from "../_data/can-user-add-transaction";
import ImportDataToTransactionTableDialog from "./_components/import-data-to-transaction-table-button";

import { columns } from "./_columns/data-table/columns";
import { DataTable } from "./_columns/data-table/data-table";

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/get-started");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  const userCanAddTransaction = await canUserAddTransaction();

  return (
    <>
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Transações</h1>
          <div className="flex items-center gap-3">
            <ImportDataToTransactionTableDialog />
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        </div>

        <div className="col-span-1 space-y-6 rounded-md bg-card">
          <ScrollArea className="h-full">
            <DataTable
              columns={columns}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
