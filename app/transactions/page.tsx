import { prisma } from "../_lib/_prisma/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import canUserAddTransaction from "../_data/can-user-add-transaction";
import ImportDataToTransactionTableDialog from "./_components/import-data-to-transaction-table-button";

import { columns } from "./_columns/data-table/columns";
import { DataTable } from "./_columns/data-table/data-table";
import { CreditCard, BarChart } from "lucide-react";
import AddRevenueButton from "../_components/add-revenue-button";
import AddExpenseButton from "../_components/add-expense-button";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <CreditCard className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Transações</h1>
                <p className="text-sm">
                  Visão completa de seus movimentos financeiros
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ImportDataToTransactionTableDialog />

              <AddRevenueButton userCanAddTransaction={userCanAddTransaction} />
              <AddExpenseButton userCanAddTransaction={userCanAddTransaction} />
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </div>

          <div className="border-t bg-gray-50 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total de Transações</p>
                  <BarChart className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-xl font-bold text-blue-700">
                  {transactions.length}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total Receitas</p>
                  <BarChart className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-xl font-bold text-green-700">
                  R${" "}
                  {transactions
                    .filter((t) => t.type === "DEPOSIT")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Total Despesas</p>
                  <BarChart className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-xl font-bold text-red-700">
                  R${" "}
                  {transactions
                    .filter((t) => t.type === "EXPENSE")
                    .reduce((sum, t) => sum + Number(t.amount), 0)
                    .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
