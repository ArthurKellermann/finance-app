import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie-chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expenses-per-category";
import LastTransactions from "./_components/last-transactions";
import canUserAddTransaction from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-reports-button";
import { Button } from "../_components/ui/button";
import { Calendar } from "lucide-react";
import MyInvestmentsPieChart from "./_components/my-investments-pie-chart";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await clerkClient().users.getUser(userId);

  return (
    <>
      <Navbar />
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost">
              Calendário
              <Calendar />
            </Button>
            <AiReportButton
              month={month}
              hasPremiumPlan={
                user.publicMetadata.subscriptionPlan === "premium"
              }
            />
            <TimeSelect />
          </div>
        </div>
        <div className="grid h-full grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />
            <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboard} />
              <MyInvestmentsPieChart
                investmentsPercentage={{
                  "Tesouro Direto": 20,
                  "Renda Fixa": 15,
                  "Renda Variável": 25,
                  FIIs: 10,
                  ETFs: 15,
                  Criptomoedas: 5,
                  "Previdência Privada": 10,
                }}
              />
            </div>
          </div>
          <div className="flex-row space-y-6">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />
            <ExpensesPerCategory
              expensesPerCategory={dashboard.totalExpensePerCategory}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
