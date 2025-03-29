"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  TrendingUp,
  TrendingDown,
  Check,
  Tag,
  CreditCard,
  Calendar,
} from "lucide-react";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/app/_components/ui/checkbox";
import type { Transaction } from "@prisma/client";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../../_components/edit-transaction-button";
import DeleteTransactionButton from "../../_components/delete-transaction-button";

type TransactionWithCategory = Transaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
};

export const columns: ColumnDef<TransactionWithCategory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="rounded border-gray-300"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="rounded border-gray-300"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="flex items-center">
          <Check className="mr-2 h-4 w-4 text-green-500" />
          <span className="font-semibold text-gray-800">
            {transaction.name}
          </span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row: { original: transaction } }) => {
      const isExpense = transaction.type === "EXPENSE";
      return (
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 ${
            isExpense ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
          } `}
        >
          {isExpense ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isExpense ? "Despesa" : "Receita"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <div
          className="flex items-center gap-2 rounded-full px-3 py-1"
          style={{
            backgroundColor: `${category.color}10`,
            color: category.color,
          }}
        >
          <Tag className="h-4 w-4" style={{ color: category.color }} />
          <span className="text-sm font-medium">
            {TRANSACTION_CATEGORY_LABELS[
              category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
            ] || category.name}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Método" />
    ),
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-gray-600">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">
            {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    cell: ({ row: { original: transaction } }) => {
      const amount = Number(transaction.amount);
      const isExpense = transaction.type === "EXPENSE";

      return (
        <div
          className={`flex items-center gap-2 font-bold ${isExpense ? "text-red-600" : "text-green-600"} `}
        >
          {isExpense ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row: { original: transaction } }) => (
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="h-4 w-4" />
        <span>
          {new Date(transaction.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    ),
    filterFn: (row, id, value) => {
      const rowDate = new Date(row.getValue(id));
      const [startDate, endDate] = value;
      return rowDate >= startDate && rowDate <= endDate;
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="flex items-center space-x-2">
          <EditTransactionButton
            transaction={transaction}
          ></EditTransactionButton>
          <DeleteTransactionButton
            transactionId={transaction.id}
          ></DeleteTransactionButton>
        </div>
      );
    },
  },
];
