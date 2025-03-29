import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import ExpensesPerCategoryDialog from "./expenses-per-category-dialog";
import { PieChart, TrendingUp } from "lucide-react";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  // Ordena categorias por porcentagem de forma decrescente
  const sortedCategories = [...expensesPerCategory].sort(
    (a, b) => b.percentageOfTotal - a.percentageOfTotal,
  );

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <PieChart className="h-6 w-6" />
            Gastos por Categoria
          </CardTitle>
          <p className="text-sm">Análise Detalhada</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {sortedCategories.map((category) => (
          <div
            key={category.id}
            className="rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <div className="mb-2 flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <IconRenderer
                    icon={category.icon as string}
                    className="h-5 w-5 opacity-70"
                  />
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {TRANSACTION_CATEGORY_LABELS[
                    category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
                  ] || category.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp
                  className="h-4 w-4"
                  style={{ color: category.color }}
                />
                <p
                  className="text-sm font-bold"
                  style={{ color: category.color }}
                >
                  {category.percentageOfTotal}%
                </p>
              </div>
            </div>

            <Progress
              value={category.percentageOfTotal}
              style={
                {
                  "--progress-foreground": category.color,
                } as React.CSSProperties
              }
              className="h-2 w-full overflow-hidden rounded-full bg-gray-200 [&>div]:!bg-[var(--progress-foreground)]"
            />
          </div>
        ))}
      </CardContent>

      <CardContent className="flex justify-center border-t bg-gray-50 p-4">
        <ExpensesPerCategoryDialog expensesPerCategory={expensesPerCategory} />
      </CardContent>
    </Card>
  );
};

export default ExpensesPerCategory;
