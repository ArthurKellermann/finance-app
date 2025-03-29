"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import type { GoalDeposit } from "@prisma/client";
import { TrendingUp, BarChart as BarChartIcon } from "lucide-react";

interface DepositsLastTwelveMonthsBarChartProps {
  deposits: GoalDeposit[];
}

const chartConfig = {
  desktop: {
    label: "Receita",
    color: "#2563eb",
  },
  mobile: {
    label: "Despesa",
    color: "#ff7f7f",
  },
} satisfies ChartConfig;

const monthMapping: Record<string, string> = {
  "jan.": "Jan.",
  "fev.": "Fev.",
  "mar.": "Mar.",
  "abr.": "Abr.",
  "mai.": "Mai.",
  "jun.": "Jun.",
  "jul.": "Jul.",
  "ago.": "Ago.",
  "set.": "Set.",
  "out.": "Out.",
  "nov.": "Nov.",
  "dez.": "Dez.",
};

export function DepositsLastTwelveMonthsBarChart({
  deposits,
}: DepositsLastTwelveMonthsBarChartProps) {
  const currentDate = new Date();

  const lastTwelveMonths = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - index);
    return date.toLocaleString("default", { month: "short" });
  }).reverse();

  const monthlyDeposits = deposits.reduce(
    (acc, deposit) => {
      const month = new Date(deposit.date).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += deposit.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const chartData = lastTwelveMonths.map((month) => ({
    month: monthMapping[month] || month,
    amount: monthlyDeposits[month] || 0,
  }));

  // Calcular total de depósitos e crescimento
  const totalDeposits = chartData.reduce((sum, item) => sum + item.amount, 0);
  const averageMonthlyDeposit = totalDeposits / 12;
  const lastMonthDeposit = chartData[chartData.length - 1].amount;
  const growthPercentage =
    ((lastMonthDeposit - averageMonthlyDeposit) / averageMonthlyDeposit) * 100;

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChartIcon className="h-6 w-6" />
            Depósitos nos Últimos 12 Meses
          </CardTitle>
          <p className="text-sm">Análise de Receita</p>
        </div>
        <div className="flex items-center gap-2 text-white">
          <TrendingUp
            className={`h-5 w-5 ${growthPercentage >= 0 ? "text-green-300" : "text-red-300"}`}
          />
          <span
            className={`text-sm font-medium ${growthPercentage >= 0 ? "text-green-200" : "text-red-200"}`}
          >
            {growthPercentage.toFixed(1)}%
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-gray-600">Total de Depósitos</p>
            <p className="text-2xl font-bold text-blue-700">
              R${" "}
              {totalDeposits.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-sm text-gray-600">Média Mensal</p>
            <p className="text-2xl font-bold text-green-700">
              R${" "}
              {averageMonthlyDeposit.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <p className="text-sm text-gray-600">Último Mês</p>
            <p className="text-2xl font-bold text-purple-700">
              R${" "}
              {lastMonthDeposit.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="min-h-[250px] w-full rounded-lg bg-gray-50 p-4"
        >
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-gray-600"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="amount"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
