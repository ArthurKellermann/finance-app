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
import { DialogDescription } from "@radix-ui/react-dialog";
import { Progress } from "@/app/_components/ui/progress";
import type { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import Link from "next/link";

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

        return <span>{categoryLabel}</span>;
      },
    },
    {
      accessorKey: "percentageOfTotal",
      header: "Porcentagem",
      cell: ({ row: { original: category } }) => (
        <div className="flex items-center gap-3">
          <Progress
            value={category.percentageOfTotal}
            style={
              {
                "--progress-foreground": category.color,
              } as React.CSSProperties
            }
            className="w-full [&>div]:!bg-[var(--progress-foreground)]"
          />
          <span className="min-w-[40px] text-right">
            {category.percentageOfTotal.toFixed(1)}%
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="transition duration-300 hover:text-blue-800"
          >
            Ver mais
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl rounded-lg bg-card p-6 shadow-lg">
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Gastos por categoria
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            <DataTable columns={categoryColumns} data={data} />
          </div>
          <DialogFooter>
            <Link href="/categories">
              <Button variant="outline">Personalizar</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesPerCategoryDialog;
