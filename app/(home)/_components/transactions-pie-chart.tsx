"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { TransactionType } from "@prisma/client";
import { TransactionPercentagePerType } from "@/app/_data/get-dashboard/types";
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
} from "lucide-react";

const chartConfig = {
  [TransactionType.INVESTMENT]: {
    label: "Investido",
    color: "#6A5ACD",
  },
  [TransactionType.DEPOSIT]: {
    label: "Receita",
    color: "#55B02E",
  },
  [TransactionType.EXPENSE]: {
    label: "Despesas",
    color: "#E93030",
  },
} satisfies ChartConfig;

interface TransactionsPieChartProps {
  depositsTotal: number;
  investmentsTotal: number;
  expensesTotal: number;
  typesPercentage: TransactionPercentagePerType;
}

const TransactionsPieChart = ({
  depositsTotal,
  investmentsTotal,
  expensesTotal,
  typesPercentage,
}: TransactionsPieChartProps) => {
  const chartData = [
    {
      type: TransactionType.DEPOSIT,
      amount: depositsTotal,
      fill: "#4183FF",
    },
    {
      type: TransactionType.EXPENSE,
      amount: expensesTotal,
      fill: "#E93030",
    },
    {
      type: TransactionType.INVESTMENT,
      amount: investmentsTotal,
      fill: "#6A5ACD",
    },
  ];

  const PercentageItem = ({
    icon,
    title,
    value,
  }: {
    icon: React.ReactNode;
    title: string;
    value: number;
  }) => (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-white p-2 shadow-sm">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">
        {value.toFixed(1)}%
      </span>
    </div>
  );

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <PieChartIcon className="h-6 w-6" />
            Distribuição de Transações
          </CardTitle>
          <p className="text-sm">Visão Geral Financeira</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="type"
                innerRadius={60}
                fill="var(--primary)"
              />
            </PieChart>
          </ChartContainer>
        </div>

        <div className="space-y-3">
          <PercentageItem
            icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
            title="Receita"
            value={typesPercentage[TransactionType.DEPOSIT]}
          />
          <PercentageItem
            icon={<TrendingDown className="h-5 w-5 text-red-500" />}
            title="Despesas"
            value={typesPercentage[TransactionType.EXPENSE]}
          />
          <PercentageItem
            icon={<PiggyBank className="h-5 w-5 text-purple-500" />}
            title="Investido"
            value={typesPercentage[TransactionType.INVESTMENT]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPieChart;
