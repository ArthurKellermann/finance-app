import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { TRANSACTION_PAYMENT_METHOD_ICONS } from "@/app/_constants/transactions";
import { formatCurrency } from "@/app/_utils/currency";
import { Transaction, TransactionType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  MoreHorizontal,
  CalendarClock,
} from "lucide-react";

interface LastTransactionsProps {
  lastTransactions: Transaction[];
}

const LastTransactions = ({ lastTransactions }: LastTransactionsProps) => {
  const getAmountColor = (transaction: Transaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return "text-red-600";
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      return "text-green-600";
    }
    return "text-gray-700";
  };

  const getAmountIcon = (transaction: Transaction) => {
    if (transaction.type === TransactionType.EXPENSE) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    if (transaction.type === TransactionType.DEPOSIT) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
    return null;
  };

  const getAmountPrefix = (transaction: Transaction) => {
    if (transaction.type === TransactionType.DEPOSIT) {
      return "+";
    }
    return "-";
  };

  const displayedTransactions = lastTransactions.slice(0, 4);

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <CreditCard className="h-6 w-6" />
            Últimas Transações
          </CardTitle>
          <p className="text-sm">Visão Geral Recente</p>
        </div>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/transactions" className="flex items-center gap-2">
            <MoreHorizontal className="h-4 w-4" />
            Detalhes
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {displayedTransactions.length > 0 ? (
          displayedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <Image
                    src={`/${TRANSACTION_PAYMENT_METHOD_ICONS[transaction.paymentMethod]}`}
                    height={24}
                    width={24}
                    alt={transaction.paymentMethod}
                    className="opacity-70"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {transaction.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getAmountIcon(transaction)}
                <p
                  className={`text-sm font-bold ${getAmountColor(transaction)}`}
                >
                  {getAmountPrefix(transaction)}
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="mb-2 text-sm text-gray-500">
              Nenhuma transação encontrada
            </p>
            <p className="text-xs text-gray-400">
              Comece a adicionar suas transações para ver o histórico
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-gray-50 p-4">
        <div className="flex w-full space-x-4">
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link href="/schedule-transaction">
              <CalendarClock className="h-4 w-4" />
              Programar transação
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-green-500 text-green-600 hover:bg-green-50"
            asChild
          >
            <Link href="/transactions">
              <MoreHorizontal className="h-4 w-4" />
              Ver mais
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LastTransactions;
