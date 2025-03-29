"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
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
import { DataTableViewOptions } from "./data-table-view-options";
import {
  PiggyBankIcon,
  TrashIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

import { deleteCategories } from "../../_actions/delete-categories";
import { useToast } from "@/app/_hooks/use-toast";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  removeDeletedRows: (ids: string[]) => void;
  refreshData?: () => Promise<void>;
}

export function DataTableToolbar<TData>({
  table,
  removeDeletedRows,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast();
  const isFiltered = table.getState().columnFilters.length > 0;

  const types = [
    {
      label: "Depósito",
      value: "DEPOSIT",
      icon: TrendingUpIcon,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Despesa",
      value: "EXPENSE",
      icon: TrendingDownIcon,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      label: "Investimento",
      value: "INVESTMENT",
      icon: PiggyBankIcon,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const handleDeleteSelectedRows = async (table: Table<any>) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    if (selectedIds.length > 0) {
      try {
        await deleteCategories(selectedIds);

        removeDeletedRows(selectedIds);

        table.resetRowSelection();
        toast({
          title: "✅ Categorias deletadas com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nome..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              table.getColumn("name")?.setFilterValue(event.target.value);
            }}
            className="h-10 min-w-[250px] rounded-full border-gray-200 bg-gray-50 pl-10 pr-4 text-gray-700 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={types}
            icon={PlusCircledIcon}
          />
        )}

        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="h-10 rounded-full border-gray-200 px-4 text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            Limpar filtros
            <XIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
              >
                <TrashIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Deletar ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-xl border-none bg-white shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-gray-800">
                  {table.getFilteredSelectedRowModel().rows.length > 1 ? (
                    <>Você deseja realmente deletar essas categorias?</>
                  ) : (
                    <>Você deseja realmente deletar essa categoria?</>
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Essa ação não pode ser desfeita e todas as subcategorias
                  associadas também serão removidas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full border-gray-200 text-gray-700 hover:bg-gray-100">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteSelectedRows(table)}
                  className="rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
