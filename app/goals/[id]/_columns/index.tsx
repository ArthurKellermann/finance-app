"use client";

import { type GoalDeposit } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import DeleteDepositButton from "../_components/delete-deposit-button";
import { Button } from "@/app/_components/ui/button";
import { ArrowUpDown } from "lucide-react";

// Transforme depositColumns em uma função que recebe onDepositDeleted
export const getDepositColumns = (
  onDepositDeleted: () => void, // Recebe a função de callback
): ColumnDef<GoalDeposit>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="link"
        className="text-muted-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Data
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row: { original: deposit } }) =>
      new Date(deposit.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    enableSorting: true,
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: deposit } }) => {
      return (
        <strong>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(deposit.amount))}
        </strong>
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
            onDepositDeleted={onDepositDeleted} // Passa a função de callback
          />
        </div>
      );
    },
  },
];
