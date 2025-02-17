"use client";

import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";
import { Button } from "@/app/_components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";

type TransactionWithCategory = Transaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
};

export const transactionColumns: ColumnDef<TransactionWithCategory>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: transaction } }) => {
      return <strong>{transaction.name}</strong>;
    },
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
    accessorKey: "paymentMethod",
    header: "Método de Pagamento",
    cell: ({ row: { original: transaction } }) => {
      return (
        <Badge className="bg-muted bg-opacity-10 font-bold text-secondary-foreground hover:bg-background">
          {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
        </Badge>
      );
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
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="space-x-1">
          <EditTransactionButton transaction={transaction} />
          <DeleteTransactionButton transactionId={transaction.id} />
        </div>
      );
    },
  },
];
