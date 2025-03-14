"use client";
import { Label, Pie, PieChart } from "recharts";
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

interface CurrentGoalAmountPieChartProps {
  currentAmount: number;
  goalAmount: number;
  color: string;
}

const chartConfig = {
  currentAmount: {
    label: "Valor depositado",
  },
  remaining: {
    label: "Restante",
    color: "#D3D3D3",
  },
} satisfies ChartConfig;
export function CurrentGoalAmountPieChart({
  currentAmount,
  goalAmount,
  color,
}: CurrentGoalAmountPieChartProps) {
  const chartData = [
    { name: "Valor depositado ", amount: currentAmount, fill: color },
    {
      name: `Valor do objetivo${" "}`,
      amount: goalAmount - currentAmount,
      fill: "#A9A9A9",
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Valor já depositado</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[250px] max-h-[250px] w-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {currentAmount}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Valor atual
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
