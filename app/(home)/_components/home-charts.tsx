"use client";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./transactions-pie-chart";
import ExpensesPerCategory from "./expenses-per-category";
import MyInvestmentsPieChart from "./my-investments-pie-chart";
import { useEffect, useState } from "react";
import MyGoalsChart from "./my-goals-chart";

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
      {selectedCharts.includes("Fluxo Mensal") && <div>Fluxo Mensal Chart</div>}
      {selectedCharts.includes("Meus Objetivos") && (
        <MyGoalsChart expensesPerCategory={dashboard.totalExpensePerCategory} />
      )}
      {selectedCharts.includes("Minhas Contas") && (
        <div>Minhas Contas Chart</div>
      )}
    </>
  );
};

export default HomeCharts;
