"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { CreditCard, Menu, Search, Filter, Trash2 } from "lucide-react";
import { CalendarDatePicker } from "@/app/_components/calendar-date-picker";
import { useEffect, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import ExportDataFromTransactionDialog from "../../_components/export-data-from-transaction-table-dialog";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
} from "@/app/_constants/transactions";
import { deleteTransactions } from "../../_actions/delete-transactions";
import { useToast } from "@/app/_hooks/use-toast";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  removeDeletedRows: (ids: string[]) => void;
}

const types = [
  { label: "Depósito", value: "DEPOSIT", icon: () => <TrendingUpIcon /> },
  { label: "Despesa", value: "EXPENSE", icon: () => <TrendingDownIcon /> },
  { label: "Investimento", value: "INVESTMENT", icon: () => <PiggyBankIcon /> },
];

export function DataTableToolbar<TData>({
  table,
  removeDeletedRows,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast();
  const isFiltered = table.getState().columnFilters.length > 0;

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    async function fetchFilterData() {
      const categories = await getDefaultCategories();
      if (!categories) return;

      const formattedCategories = categories.map((category) => ({
        label:
          TRANSACTION_CATEGORY_LABELS[
            category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
          ] || category.name,
        value: category.id,
      }));

      setCategories(formattedCategories);
    }
    fetchFilterData();
  }, []);

  const paymentMethods = TRANSACTION_PAYMENT_METHOD_OPTIONS.map((method) => ({
    label: method.label,
    value: method.value,
  }));

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  const handleDeleteSelectedRows = async (table: Table<any>) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    if (selectedIds.length > 0) {
      try {
        await deleteTransactions(selectedIds);
        removeDeletedRows(selectedIds);
        table.resetRowSelection();
        toast({ title: "✅ Transações deletadas com sucesso!" });
      } catch (error) {
        console.error("Erro ao deletar transações:", error);
      }
    }
  };

  return (
    <div className="rounded-t-xl border-b bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nome..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) => {
                table.getColumn("name")?.setFilterValue(event.target.value);
              }}
              className="h-10 w-64 rounded-full border-gray-300 pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {table.getColumn("type") && (
              <DataTableFacetedFilter
                column={table.getColumn("type")}
                title="Tipo"
                options={types}
                icon={Filter}
              />
            )}
            {table.getColumn("category") && (
              <DataTableFacetedFilter
                column={table.getColumn("category")}
                title="Categoria"
                options={categories}
                icon={Menu}
              />
            )}
            {table.getColumn("payment_method") && (
              <DataTableFacetedFilter
                column={table.getColumn("payment_method")}
                title="Método"
                options={paymentMethods}
                icon={CreditCard}
              />
            )}
          </div>

          <CalendarDatePicker
            date={dateRange}
            onDateSelect={handleDateSelect}
            className="h-10 w-64"
            variant="outline"
          />

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-10 rounded-full px-4"
            >
              Limpar
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2 rounded-full"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar ({table.getFilteredSelectedRowModel().rows.length})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deletar transações selecionadas?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteSelectedRows(table)}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <ExportDataFromTransactionDialog userCanExportData={true} />
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  );
}
