import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  Goal,
} from "lucide-react";
import Link from "next/link";

const AiInsightsCard = () => {
  const insights = {
    totalSpending: 7350,
    potentialSavings: 845,
    financialScore: 7.2,
    topCategories: [
      { name: "Alimentação", percentage: 35, impact: "high" },
      { name: "Transporte", percentage: 25, impact: "medium" },
      { name: "Assinaturas", percentage: 15, impact: "low" },
    ],
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <PieChart className="h-6 w-6" />
            Relatório de Insights Financeiros
          </CardTitle>
          <p className="text-sm text-white/80">
            Análise Inteligente - Março 2025
          </p>
        </div>
        <Button
          variant="secondary"
          className="bg-white/20 text-white transition-colors hover:bg-white/30"
          asChild
        >
          <Link href="/transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Detalhes
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Gastos Totais</p>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-blue-700">
              R$ {insights.totalSpending.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Economia Potencial</p>
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-700">
              R$ {insights.potentialSavings.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Pontuação Financeira</p>
              <Goal className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-700">
              {insights.financialScore}/10
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-800">
            Categorias de Maior Impacto
          </h3>
          {insights.topCategories.map((category) => (
            <div
              key={category.name}
              className={`mb-2 flex items-center justify-between rounded-lg p-3 ${
                category.impact === "high"
                  ? "bg-red-50"
                  : category.impact === "medium"
                    ? "bg-yellow-50"
                    : "bg-green-50"
              } `}
            >
              <span className="font-medium text-gray-700">{category.name}</span>
              <span
                className={`font-bold ${
                  category.impact === "high"
                    ? "text-red-600"
                    : category.impact === "medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                } `}
              >
                {category.percentage}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 p-4">
        <p className="text-xs italic text-gray-500">
          Relatório gerado por IA em 27/03/2025 - FinanceAssist
        </p>
      </CardFooter>
    </Card>
  );
};

export default AiInsightsCard;
