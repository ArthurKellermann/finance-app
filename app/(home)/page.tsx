import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import { Home as HomeIcon } from "lucide-react";

import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { getDashboard } from "../_data/get-dashboard";
import LastTransactions from "./_components/last-transactions";
import canUserAddTransaction from "../_data/can-user-add-transaction";
import CreditCards from "./_components/credit-cards";
import { AmountVisibilityProvider } from "../_contexts/amount-visibility-context";
import CustomizeHomeChartsDialog from "./_components/customize-home-charts-dialog";
import HomeCharts from "./_components/home-charts";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/get-started");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  const dashboard = await getDashboard(month);
  const userCanAddTransaction = await canUserAddTransaction();
  const user = await clerkClient().users.getUser(userId);

  return (
    <AmountVisibilityProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Cabeçalho com gradiente */}
        <div>
          <div className="ml-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HomeIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">
                Olá, <span>{user.firstName}!</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <CustomizeHomeChartsDialog />
              </div>
              {/* <Button variant="outline" className="rounded-full">
                <NotebookIcon className="h-4 w-4" />
                Planejamento
              </Button>

              <AiReportButton
                month={month}
                hasPremiumPlan={
                  user.publicMetadata.subscriptionPlan === "premium"
                }
              />

              <Button variant="outline" className="rounded-full">
                <CreditCard className="h-4 w-4" />
                Contas
              </Button> */}

              <TimeSelect />
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-[2fr,1fr] gap-6 p-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            <SummaryCards
              month={month}
              {...dashboard}
              userCanAddTransaction={userCanAddTransaction}
            />

            <HomeCharts dashboard={dashboard} month={month} />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            <LastTransactions lastTransactions={dashboard.lastTransactions} />

            <CreditCards
              creditCards={dashboard.creditCards}
              totalSpentByCreditCardPerMonth={
                dashboard.totalSpentByCreditCardPerMonth
              }
              month={month}
            />
          </div>
        </div>
      </div>
    </AmountVisibilityProvider>
  );
};

export default Home;
