"use client";

import { Transaction, type CreditCard } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "@/app/transactions/_components/type-badge";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Button } from "@/app/_components/ui/button";
import {
  ArrowUpDown,
  Calendar,
  CreditCard as CardIcon,
  Coins,
  Tag,
  FileText,
} from "lucide-react";
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
    header: ({}) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <FileText className="h-4 w-4 text-blue-500" />
        <span>Nome</span>
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-gray-800">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({}) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Tag className="h-4 w-4 text-purple-500" />
        <span>Tipo</span>
      </div>
    ),
    cell: ({ row: { original: transaction } }) => (
      <TransactionTypeBadge transaction={transaction} />
    ),
  },
  {
    accessorKey: "category_name",
    header: ({}) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Tag className="h-4 w-4 text-indigo-500" />
        <span>Categoria</span>
      </div>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return (
        <Badge
          className="rounded-full bg-opacity-10 px-3 py-1 font-medium shadow-sm"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
            border: `1px solid ${category.color}30`,
          }}
        >
          <div className="flex items-center gap-2">
            <IconRenderer
              icon={category.icon}
              style={{ height: "1.2rem", width: "1.2rem" }}
            />
            <span className="text-xs">
              {TRANSACTION_CATEGORY_LABELS[
                category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
              ] || category.name}
            </span>
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
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Coins className="h-4 w-4 text-green-500" />
        <Button
          variant="link"
          className="p-0 font-semibold text-gray-700"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-3 w-3 text-gray-500" />
        </Button>
      </div>
    ),
    cell: ({ row: { original: transaction } }) => {
      const amount = Number(transaction.amount);
      const isExpense = transaction.type === "EXPENSE";
      const textColor = isExpense ? "text-red-600" : "text-green-600";

      return (
        <div className={`font-bold ${textColor} flex items-center gap-1`}>
          {isExpense ? "-" : "+"}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Calendar className="h-4 w-4 text-orange-500" />
        <Button
          variant="link"
          className="p-0 font-semibold text-gray-700"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data
          <ArrowUpDown className="ml-2 h-3 w-3 text-gray-500" />
        </Button>
      </div>
    ),
    cell: ({ row: { original: transaction } }) => {
      const date = new Date(transaction.date);
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "creditCard.name",
    header: ({}) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <CardIcon className="h-4 w-4 text-blue-500" />
        <span>Cartão</span>
      </div>
    ),
    cell: ({ row: { original: transaction } }) => {
      if (!transaction.creditCard?.description) {
        return <span className="text-sm text-gray-400">Não aplicável</span>;
      }

      return (
        <div className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
          {transaction.creditCard.description}
        </div>
      );
    },
  },
];
