"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
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
  BarChart3,
  ChevronRight,
} from "lucide-react";

const chartConfig = {
  revenue: {
    label: "Receita",
    color: "#2563eb",
  },
  expense: {
    label: "Despesa",
    color: "#ff7f7f",
  },
  investment: {
    label: "Investimento",
    color: "#34D399",
  },
} satisfies ChartConfig;

interface MonthlyFlowChartProps {
  chartData: {
    day: number;
    revenue: number;
    expenses: number;
    investment: number;
  }[];
}

export function MonthlyFlowChart({ chartData }: MonthlyFlowChartProps) {
  // Calcular totais para resumo
  const totals = chartData.reduce(
    (acc, curr) => ({
      revenue: acc.revenue + curr.revenue,
      expenses: acc.expenses + curr.expenses,
      investment: acc.investment + curr.investment,
    }),
    { revenue: 0, expenses: 0, investment: 0 },
  );

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <BarChart3 className="h-6 w-6" />
            Fluxo Mensal
          </CardTitle>
          <p className="text-sm">Visão Geral Financeira</p>
        </div>
        <Button variant="outline" className="rounded-full" asChild>
          <Link href="/transactions" className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            Detalhes
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Receita</p>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-lg font-bold text-blue-700">
              R${" "}
              {totals.revenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Despesas</p>
              <TrendingDown className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-lg font-bold text-red-700">
              R${" "}
              {totals.expenses.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Investimentos</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-lg font-bold text-green-700">
              R${" "}
              {totals.investment.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                strokeOpacity={0.7}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                className="text-gray-500"
              />
              <YAxis
                className="text-gray-500"
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "#f0f0f0" }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartConfig.revenue.color}
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke={chartConfig.expense.color}
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="investment"
                stroke={chartConfig.investment.color}
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-2 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50"
          asChild
        >
          <Link href="/transactions">
            <ChevronRight className="h-4 w-4" />
            Ver todas transações
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
