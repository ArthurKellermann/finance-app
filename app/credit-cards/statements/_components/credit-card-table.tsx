"use client";
import { useState } from "react";
import { DataTable } from "../_columns/data-table";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { transactionColumns } from "../_columns";
import CreditCardSpendingBarChart from "./credit-card-spending-chart";
import CreditCardDetails from "./credit-card-details";
import { CreditCard, type Transaction } from "@prisma/client";

export type TransactionWithCreditCard = Transaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
  creditCard: CreditCard;
};

interface CreditCardTableProps {
  transactions: Transaction[];
  chartData: any[];
  uniqueCards: any[];
}

const CreditCardTable = ({
  transactions,
  chartData,
  uniqueCards,
}: CreditCardTableProps) => {
  const [selectedCard, setSelectedCard] =
    useState<TransactionWithCreditCard | null>(null);

  const handleRowClick = (transaction: TransactionWithCreditCard) => {
    if (transaction.creditCard) {
      setSelectedCard(transaction);
    }
  };

  return (
    <>
      <CreditCardSpendingBarChart
        chartData={chartData}
        uniqueCards={uniqueCards}
      />
      <div className="grid grid-cols-2 gap-4">
        {/* Tabela de Transações */}
        <div className="col-span-1 space-y-6 rounded-md bg-card">
          <ScrollArea className="h-[600px]">
            <DataTable
              columns={transactionColumns}
              data={JSON.parse(JSON.stringify(transactions))}
              onRowClick={handleRowClick}
            />
          </ScrollArea>
        </div>

        <div className="col-span-1">
          {selectedCard ? (
            <CreditCardDetails
              card={selectedCard.creditCard}
              transactions={transactions}
            />
          ) : (
            <div className="flex h-full items-center justify-center rounded-md bg-card p-6">
              <p className="text-muted-foreground">
                Selecione uma transação para ver os detalhes do cartão.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreditCardTable;
