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
import { Card, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

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
  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <h3 className="text-center text-lg font-semibold">Fluxo Mensal</h3>

        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `Dia ${value}`}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={chartConfig.revenue.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke={chartConfig.expense.color}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="investment"
                stroke={chartConfig.investment.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Button variant="link" className="mt-3 w-full">
          <Link href="/transactions">Ver transações</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
