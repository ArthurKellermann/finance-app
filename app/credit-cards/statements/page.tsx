import getTransactionsByPaymentMethod from "@/app/_actions/get-transactions-by-payment-method";
import TimeSelectCreditCard from "../_components/time-select-credit-card";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import CreditCardSpendingBarChart from "./_components/credit-card-spending-chart";
import { DataTable } from "./_columns/data-table/data-table";
import { columns } from "./_columns/data-table/columns";

const CreditCardsStatementsPage = async () => {
  const { transactions } = await getTransactionsByPaymentMethod("CREDIT_CARD");

  const uniqueCards = Array.from(
    new Set(transactions.map((t) => t.creditCard?.description).filter(Boolean)),
  );

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const chartData = last30Days.map((date) => {
    const dailyData: any = { date };

    uniqueCards.forEach((card) => {
      if (card) {
        const total = transactions
          .filter(
            (t) =>
              t.date.toISOString().split("T")[0] === date &&
              t.creditCard?.description === card,
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);

        dailyData[card] = total;
      }
    });

    return dailyData;
  });

  return (
    <div className="flex flex-col space-y-6 overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Faturas Cartão de Crédito</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Link href="/credit-cards">Cartões de Crédito</Link>
          </Button>
          <TimeSelectCreditCard />
        </div>
      </div>
      <DataTable data={transactions} columns={columns} />
      <CreditCardSpendingBarChart
        chartData={chartData}
        uniqueCards={uniqueCards}
      />
    </div>
  );
};

export default CreditCardsStatementsPage;
