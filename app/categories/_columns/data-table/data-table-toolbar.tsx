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
import { DataTableViewOptions } from "./data-table-view-options";
import {
  PiggyBankIcon,
  TrashIcon,
  TrendingDownIcon,
  TrendingUpIcon,
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

        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
