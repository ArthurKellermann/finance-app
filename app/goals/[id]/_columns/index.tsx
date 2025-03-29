"use client";

import { type GoalDeposit } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDepositButton from "../_components/delete-deposit-button";
import { Button } from "@/app/_components/ui/button";
import { ArrowUpDown, TrendingUp, Calendar } from "lucide-react";

export const getDepositColumns = (
  onDepositDeleted: () => void,
): ColumnDef<GoalDeposit>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center text-gray-600 transition-colors hover:bg-gray-100 hover:text-blue-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row: { original: deposit } }) => (
      <div className="flex items-center gap-2 text-gray-700">
        <Calendar className="h-4 w-4 text-blue-500 opacity-70" />
        {new Date(deposit.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center text-gray-600 transition-colors hover:bg-gray-100 hover:text-green-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        Valor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row: { original: deposit } }) => {
      const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(deposit.amount));

      return (
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500 opacity-70" />
          <strong className="text-green-700">{formattedAmount}</strong>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: deposit } }) => {
      return (
        <div className="space-x-1">
          <DeleteDepositButton
            depositId={deposit.id}
            onDepositDeleted={onDepositDeleted}
          />
        </div>
      );
    },
  },
];
