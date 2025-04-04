"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columnsMapping = {
    select: { accessorKey: "select", header: "Select" },
    name: { accessorKey: "name", header: "Nome" },
    status: { accessorKey: "status", header: "Status" },
    type: { accessorKey: "type", header: "Tipo" },
    category: { accessorKey: "category", header: "Categoria" },
    payment_method: {
      accessorKey: "payment_method",
      header: "Método de Pagamento",
    },
    amount: { accessorKey: "amount", header: "Valor" },
    recurrence: { accessorKey: "recurrence", header: "Recorrência" },
    dateRange: { accessorKey: "dateRange", header: "Período" },
    description: { accessorKey: "description", header: "Descrição" },
    actions: { accessorKey: "actions", header: "Ações" },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          Colunas
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Colunas visíveis</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {
                  columnsMapping[column.id as keyof typeof columnsMapping]
                    .header
                }
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
