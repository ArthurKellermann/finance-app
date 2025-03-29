"use client";

import { DataTable } from "@/app/_components/ui/data-table";
import { Button } from "../../_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../_components/ui/dialog";
import { ColumnDef } from "@tanstack/react-table";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Progress } from "@/app/_components/ui/progress";
import type { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import Link from "next/link";
import { PieChart, Edit, List, ChevronRight } from "lucide-react";

interface EditCategoryDialogProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategoryDialog = ({
  expensesPerCategory,
}: EditCategoryDialogProps) => {
  const data = expensesPerCategory.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    percentageOfTotal: category.percentageOfTotal,
  }));

  if (data.length === 0) {
    return null;
  }

  const categoryColumns: ColumnDef<(typeof data)[number]>[] = [
    {
      accessorKey: "name",
      header: "Categoria",
      cell: ({ row: { original: category } }) => {
        const categoryLabel =
          TRANSACTION_CATEGORY_LABELS[
            category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
          ] || category.name;

        return (
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-sm font-medium text-gray-700">
              {categoryLabel}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "percentageOfTotal",
      header: "Porcentagem",
      cell: ({ row: { original: category } }) => (
        <div className="flex items-center gap-4">
          <Progress
            value={category.percentageOfTotal}
            style={
              {
                "--progress-foreground": category.color,
              } as React.CSSProperties
            }
            className="w-full bg-gray-200 [&>div]:!bg-[var(--progress-foreground)]"
          />
          <span className="min-w-[40px] text-right text-sm font-bold text-gray-700">
            {category.percentageOfTotal.toFixed(1)}%
          </span>
        </div>
      ),
    },
  ];

  const totalCategories = data.length;
  const highestExpenseCategory = data.reduce((prev, current) =>
    prev.percentageOfTotal > current.percentageOfTotal ? prev : current,
  );

  return (
    <div className="p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 rounded-full border-blue-500 text-blue-600 transition-colors hover:bg-blue-50"
          >
            Ver mais
            <ChevronRight className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl rounded-xl border-none shadow-2xl">
          <div className="rounded-t-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                    <PieChart className="h-6 w-6" />
                    Gastos por Categoria
                  </DialogTitle>
                  <p className="mt-1 text-sm text-white/80">
                    Análise detalhada de seus gastos
                  </p>
                </div>
                <div className="rounded-full bg-white/20 p-2">
                  <List className="h-5 w-5 text-white" />
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6">
            <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-500">Total de Categorias</p>
                <p className="text-lg font-bold text-blue-700">
                  {totalCategories}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">
                  Categoria com Maior Gasto
                </p>
                <p className="text-lg font-bold text-red-700">
                  {TRANSACTION_CATEGORY_LABELS[
                    highestExpenseCategory.name as keyof typeof TRANSACTION_CATEGORY_LABELS
                  ] || highestExpenseCategory.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">% Maior Gasto</p>
                <p className="text-lg font-bold text-red-700">
                  {highestExpenseCategory.percentageOfTotal.toFixed(1)}%
                </p>
              </div>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              <DataTable columns={categoryColumns} data={data} />
            </div>
          </div>

          <DialogFooter className="rounded-b-xl border-t bg-gray-50 p-4">
            <Link href="/categories" className="w-full">
              <Button
                variant="outline"
                className="flex w-full items-center justify-center gap-2 rounded-full border-green-500 text-green-600 hover:bg-green-50"
              >
                <Edit className="h-4 w-4" />
                Personalizar Categorias
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesPerCategoryDialog;
