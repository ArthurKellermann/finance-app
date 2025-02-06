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
  desktop: {
    label: "Receita",
    color: "#2563eb",
  },
  mobile: {
    label: "Despesa",
    color: "#ff7f7f",
  },
} satisfies ChartConfig;

export function MonthlyFlowChart() {
  const chartData = [
    { day: "1", desktop: 186, mobile: 80, tablet: 120 },
    { day: "2", desktop: 305, mobile: 200, tablet: 150 },
    { day: "3", desktop: 237, mobile: 120, tablet: 110 },
    { day: "4", desktop: 73, mobile: 190, tablet: 160 },
    { day: "5", desktop: 209, mobile: 130, tablet: 140 },
    { day: "6", desktop: 214, mobile: 140, tablet: 130 },
  ];

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
                dataKey="desktop"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mobile"
                stroke="#ff7f7f"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="tablet"
                stroke="#34D399"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <Button variant="link" className="mt-3 w-full">
          <Link href="/portfolio">Ver carteira</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
