"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { EyeIcon, EyeOffIcon, TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";
import { useAmountVisibility } from "@/app/_contexts/amount-visibility-context";
import AddExpenseButton from "@/app/_components/add-expense-button";
import AddRevenueButton from "@/app/_components/add-revenue-button";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  const { isAmountVisible, toggleAmountVisibility } = useAmountVisibility();

  const maskedAmount = "********";

  const formatCurrency = (value: number) =>
    Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-white/20 p-2">{icon}</div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
        </div>

        {size === "large" && (
          <div
            onClick={toggleAmountVisibility}
            className="cursor-pointer rounded-full p-2 transition-colors"
          >
            {isAmountVisible ? (
              <EyeIcon className="h-5 w-5" />
            ) : (
              <EyeOffIcon className="h-5 w-5" />
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {amount >= 0 ? (
              <TrendingUp className="h-6 w-6 text-green-500" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-500" />
            )}
            <p
              className={`font-bold ${size === "small" ? "text-2xl" : "text-3xl"} ${amount >= 0 ? "text-green-700" : "text-red-700"} `}
            >
              {isAmountVisible ? formatCurrency(amount) : maskedAmount}
            </p>
          </div>

          {size === "large" && (
            <div className="flex items-center gap-3">
              <AddRevenueButton userCanAddTransaction={userCanAddTransaction} />

              <AddExpenseButton userCanAddTransaction={userCanAddTransaction} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
