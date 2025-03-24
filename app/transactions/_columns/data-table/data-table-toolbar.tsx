"use client";

import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
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
// import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { CalendarDatePicker } from "@/app/_components/calendar-date-picker";
import { useEffect, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  CreditCard,
  Menu,
  PiggyBankIcon,
  TrashIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
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
            category.value as keyof typeof TRANSACTION_CATEGORY_LABELS
          ] || category.value,
        value: category.categoryId,
      }));

      setCategories(formattedCategories);
    }
    fetchFilterData();
  }, []);

  const paymentMethods = TRANSACTION_PAYMENT_METHOD_OPTIONS.map((method) => ({
    label: method.label,
    value: method.value,
  }));

  const types = [
    {
      label: "Depósito",
      value: "DEPOSIT",
      icon: TrendingUpIcon,
    },
    {
      label: "Despesa",
      value: "EXPENSE",
      icon: TrendingDownIcon,
    },
    {
      label: "Investimento",
      value: "INVESTMENT",
      icon: PiggyBankIcon,
    },
  ];

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
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
        toast({
          title: "✅ Transações deletadas com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao deletar transações:", error);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Buscar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={types}
            icon={PlusCircledIcon}
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
            title="Método de Pagamento"
            options={paymentMethods}
            icon={CreditCard}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Resetar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="h-9 w-[250px]"
          variant="outline"
        />
      </div>

      <div className="flex items-center gap-2">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                Deletar ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {table.getFilteredSelectedRowModel().rows.length > 1 ? (
                    <>Você deseja realmente deletar essas transações?</>
                  ) : (
                    <>Você deseja realmente deletar essa transação?</>
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteSelectedRows(table)}
                >
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
        <ExportDataFromTransactionDialog userCanExportData={true} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
