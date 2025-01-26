"use client";
import { useState } from "react";
import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  const [isAmountVisible, setIsAmountVisible] = useState(true);

  const toggleAmountVisibility = () => {
    setIsAmountVisible(!isAmountVisible);
  };

  const maskedAmount = "********";

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-4">
        {icon}
        <p
          className={`${size === "small" ? "text-muted-foreground" : "font-bold text-muted-foreground opacity-70"}`}
        >
          {title}
        </p>
        {size === "large" && (
          <div onClick={toggleAmountVisibility} className="cursor-pointer">
            {isAmountVisible ? <EyeIcon size={25} /> : <EyeOffIcon size={25} />}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p
          className={`font-bold ${size === "small" ? "text-2xl" : "text-4xl"}`}
        >
          {isAmountVisible
            ? Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(amount)
            : maskedAmount}
        </p>

        {size === "large" && userCanAddTransaction && (
          <div>
            <AddTransactionButton
              userCanAddTransactions={userCanAddTransaction}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
