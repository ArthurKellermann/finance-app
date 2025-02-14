import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import { getDashboard } from "../_data/get-dashboard";
import LastTransactions from "./_components/last-transactions";
import canUserAddTransaction from "../_data/can-user-add-transaction";
import AiReportButton from "./_components/ai-reports-button";
import { Button } from "../_components/ui/button";
import { NotebookIcon } from "lucide-react";
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
      <AmountVisibilityProvider>
        <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <CustomizeHomeChartsDialog />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="bg-white">
                Planejamento
                <NotebookIcon />
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

              <HomeCharts dashboard={dashboard} month={month} />
            </div>

            <div className="flex-row space-y-6">
              <LastTransactions lastTransactions={dashboard.lastTransactions} />

              <CreditCards
                creditCards={dashboard.creditCards}
                totalSpentByCreditCardPerMonth={
                  dashboard.totalSpentByCreditCardPerMonth
                }
              />
            </div>
          </div>
        </div>
      </AmountVisibilityProvider>
    </>
  );
};

export default Home;
