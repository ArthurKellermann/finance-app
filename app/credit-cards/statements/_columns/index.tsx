"use client";

import { Transaction, type CreditCard } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "@/app/transactions/_components/type-badge";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Button } from "@/app/_components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";

export type TransactionWithCategory = Transaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
  creditCard: CreditCard;
};

export const transactionColumns: ColumnDef<TransactionWithCategory>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category_name",
    header: "Categoria",
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge
          className="bg-muted bg-opacity-10 font-bold hover:bg-background"
          style={{ color: category.color }}
        >
          <div className="flex items-center gap-2">
            <IconRenderer
              icon={category.icon}
              style={{ height: "1.2rem", width: "1.2rem" }}
            />
            {TRANSACTION_CATEGORY_LABELS[
              category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
            ] || category.name}
          </div>
        </Badge>
      );
    },
    enableColumnFilter: true,
    filterFn: (row, columnId, filterValue) => {
      const category = row.getValue(columnId);
      return filterValue === "all" || category === filterValue;
    },
  },

  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original: transaction } }) => {
      return (
        <strong>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(transaction.amount))}
        </strong>
      );
    },
    enableSorting: true,
  },
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
    cell: ({ row: { original: transaction } }) =>
      new Date(transaction.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    enableSorting: true,
  },
  {
    accessorKey: "creditCard.name",
    header: "Cartão de Crédito",
    cell: ({ row: { original: transaction } }) => {
      return <strong>{transaction.creditCard?.description || "N/A"}</strong>;
    },
  },
];
