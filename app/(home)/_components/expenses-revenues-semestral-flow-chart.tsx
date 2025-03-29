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
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart as BarChartIcon,
} from "lucide-react";

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

export function ExpensesRevenuesSemestralFlowChart() {
  const chartData = [
    { month: "Janeiro", desktop: 186, mobile: 80 },
    { month: "Fevereiro", desktop: 305, mobile: 200 },
    { month: "Março", desktop: 237, mobile: 120 },
    { month: "Abril", desktop: 73, mobile: 190 },
    { month: "Maio", desktop: 209, mobile: 130 },
    { month: "Junho", desktop: 214, mobile: 140 },
  ];

  const calculateTotals = () => {
    const totalRevenue = chartData.reduce((sum, item) => sum + item.desktop, 0);
    const totalExpenses = chartData.reduce((sum, item) => sum + item.mobile, 0);
    return { totalRevenue, totalExpenses };
  };

  const { totalRevenue, totalExpenses } = calculateTotals();

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChartIcon className="h-6 w-6" />
            Fluxo Semestral
          </CardTitle>
          <p className="text-sm">Despesas e Receitas</p>
        </div>
        <Button variant="outline" className="transition-colors" asChild>
          <Link href="/portfolio" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Carteira
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Receita Total</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-700">
              R$ {totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Despesa Total</p>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-red-700">
              R$ {totalExpenses.toLocaleString()}
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
              stroke="#e0e0e0"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              className="text-gray-600"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="mobile"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500"></div>
            <span>Receita</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500"></div>
            <span>Despesa</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
