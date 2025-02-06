"use client";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./transactions-pie-chart";
import ExpensesPerCategory from "./expenses-per-category";
import MyInvestmentsPieChart from "./my-investments-pie-chart";
import { useEffect, useState } from "react";
import MyGoalsChart from "./my-goals-chart";
import { ExpensesRevenuesSemestralFlowChart } from "./expenses-revenues-semestral-flow-chart";
import { MonthlyFlowChart } from "./monthly-flow-chart";

interface HomeProps {
  month: string;
  dashboard: any;
}

const HomeCharts = ({ month, dashboard }: HomeProps) => {
  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);

  useEffect(() => {
    const savedCharts = localStorage.getItem("selectedCharts");
    if (savedCharts) {
      setSelectedCharts(JSON.parse(savedCharts));
    }
  }, []);

  return (
    <>
      <div className="grid h-full grid-cols-3 grid-rows-1 gap-6 overflow-hidden">
        {selectedCharts.includes("Fluxo Semestral de Despesas e Receitas") && (
          <div className="col-span-2">
            <ExpensesRevenuesSemestralFlowChart />
          </div>
        )}
        {selectedCharts.includes("Fluxo Mensal") && (
          <div className="col-span-2">
            <MonthlyFlowChart />
          </div>
        )}
        {selectedCharts.includes("Distribuição de Transações") && (
          <TransactionsPieChart {...dashboard} />
        )}
        {selectedCharts.includes("Meus Investimentos") && (
          <MyInvestmentsPieChart
            investmentsPercentage={{
              "Tesouro Direto": 20,
              "Renda Fixa": 15,
              "Renda Variável": 25,
              FIIs: 10,
              ETFs: 15,
              Criptomoedas: 5,
              "Previdência Privada": 10,
            }}
          />
        )}
        {selectedCharts.includes("Gastos por Categoria") && (
          <ExpensesPerCategory
            expensesPerCategory={dashboard.totalExpensePerCategory}
          />
        )}
        {selectedCharts.includes("Meus Objetivos") && (
          <MyGoalsChart
            expensesPerCategory={dashboard.totalExpensePerCategory}
          />
        )}
      </div>
    </>
  );
};

export default HomeCharts;
