"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { Card, CardContent } from "@/app/_components/ui/card";
import type { GoalDeposit } from "@prisma/client";

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

  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 space-y-8 pb-0">
        <h3 className="text-center text-lg font-semibold">
          Depositos nos Ultimos 12 Meses
        </h3>

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
