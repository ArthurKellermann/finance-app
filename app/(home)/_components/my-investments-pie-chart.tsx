"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import { PiggyBankIcon } from "lucide-react";
import PercentageItem from "./percentage-item";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";

const chartConfig = {
  "Tesouro Direto": {
    label: "Tesouro Direto",
    color: "#FFAB00",
  },
  "Renda Fixa": {
    label: "Renda Fixa",
    color: "#00B5E2",
  },
  "Renda Variável": {
    label: "Renda Variável",
    color: "#FF5733",
  },
  FIIs: {
    label: "Fundos Imobiliários (FIIs)",
    color: "#8E44AD",
  },
  ETFs: {
    label: "ETFs",
    color: "#3498DB",
  },
  Criptomoedas: {
    label: "Criptomoedas",
    color: "#F39C12",
  },
  "Previdência Privada": {
    label: "Previdência Privada",
    color: "#1ABC9C",
  },
} satisfies ChartConfig;

interface MyInvestmentsChartProps {
  investmentsPercentage: Record<string, number>;
}

const MyInvestmentsPieChart = ({
  investmentsPercentage,
}: MyInvestmentsChartProps) => {
  const chartData = [
    {
      type: "Tesouro Direto",
      amount: investmentsPercentage["Tesouro Direto"] || 20,
      fill: "#FFAB00",
    },
    {
      type: "Renda Fixa",
      amount: investmentsPercentage["Renda Fixa"] || 15,
      fill: "#00B5E2",
    },
    {
      type: "Renda Variável",
      amount: investmentsPercentage["Renda Variável"] || 25,
      fill: "#FF5733",
    },
    {
      type: "FIIs",
      amount: investmentsPercentage["FIIs"] || 10,
      fill: "#8E44AD",
    },
    {
      type: "ETFs",
      amount: investmentsPercentage["ETFs"] || 15,
      fill: "#3498DB",
    },
    {
      type: "Criptomoedas",
      amount: investmentsPercentage["Criptomoedas"] || 5,
      fill: "#F39C12",
    },
    {
      type: "Previdência Privada",
      amount: investmentsPercentage["Previdência Privada"] || 10,
      fill: "#1ABC9C",
    },
  ];

  return (
    <Card className="flex flex-col p-6">
      <CardContent className="flex-1 pb-0">
        <h3 className="text-center text-lg font-semibold">
          Meus Investimentos
        </h3>

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

        <div className="space-y-1">
          {Object.keys(chartConfig)
            .slice(0, 3)
            .map((investmentType) => (
              <PercentageItem
                key={investmentType}
                icon={<PiggyBankIcon size={16} />}
                title={investmentType}
                value={investmentsPercentage[investmentType] || 0}
              />
            ))}
        </div>

        <Button variant="link" className="mt-3 w-full">
          <Link href="/portfolio">Ver carteira</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default MyInvestmentsPieChart;
