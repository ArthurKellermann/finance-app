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
    color: "#0D47A1", // azul escuro profundo
  },
  "Renda Fixa": {
    label: "Renda Fixa",
    color: "#1565C0", // azul marinho
  },
  "Renda Variável": {
    label: "Renda Variável",
    color: "#1976D2", // azul royal
  },
  FIIs: {
    label: "Fundos Imobiliários (FIIs)",
    color: "#1E88E5", // azul médio
  },
  ETFs: {
    label: "ETFs",
    color: "#42A5F5", // azul claro
  },
  Criptomoedas: {
    label: "Criptomoedas",
    color: "#64B5F6", // azul claro suave
  },
  "Previdência Privada": {
    label: "Previdência Privada",
    color: "#90CAF9", // azul bem claro
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
      fill: "#0D47A1", // azul escuro profundo
    },
    {
      type: "Renda Fixa",
      amount: investmentsPercentage["Renda Fixa"] || 15,
      fill: "#1E88E5", // azul médio
    },
    {
      type: "Renda Variável",
      amount: investmentsPercentage["Renda Variável"] || 25,
      fill: "#42A5F5", // azul claro
    },
    {
      type: "FIIs",
      amount: investmentsPercentage["FIIs"] || 10,
      fill: "#64B5F6", // azul suave
    },
    {
      type: "ETFs",
      amount: investmentsPercentage["ETFs"] || 15,
      fill: "#90CAF9", // azul bem claro
    },
    {
      type: "Criptomoedas",
      amount: investmentsPercentage["Criptomoedas"] || 5,
      fill: "#BBDEFB", // azul muito claro
    },
    {
      type: "Previdência Privada",
      amount: investmentsPercentage["Previdência Privada"] || 10,
      fill: "#E1F5FE", // azul quase branco
    },
  ];

  return (
    <Card className="card-shadow flex flex-col p-6">
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
