"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  TrendingUp,
  TrendingDown,
  Check,
  Tag,
  CreditCard,
  Calendar,
  Repeat,
  AlertCircle,
  Clock,
  CalendarRange,
} from "lucide-react";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/app/_components/ui/checkbox";
import type { ScheduledTransaction } from "@prisma/client";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  RECURRENCE_TYPE_LABELS,
  SCHEDULED_TRANSACTION_STATUS_LABELS,
} from "@/app/_constants/transactions";
import EditScheduledTransactionButton from "../../_components/edit-scheduled-transaction-button";
import DeleteScheduledTransactionButton from "../../_components/delete-scheduled-transaction-button";
import { Badge } from "@/app/_components/ui/badge";

type ScheduleTransactionWithCategory = ScheduledTransaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
  subCategory?: {
    name: string;
    color: string;
    icon: string;
  } | null;
  creditCard?: {
    name: string;
    brand: string;
  } | null;
};

export const columns: ColumnDef<ScheduleTransactionWithCategory>[] = [
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row: { original: transaction } }) => {
      const statusConfig = {
        ACTIVE: {
          bg: "bg-green-50",
          text: "text-green-600",
          icon: <Check className="h-4 w-4" />,
        },
        PAUSED: {
          bg: "bg-yellow-50",
          text: "text-yellow-600",
          icon: <Clock className="h-4 w-4" />,
        },
        COMPLETED: {
          bg: "bg-blue-50",
          text: "text-blue-600",
          icon: <Check className="h-4 w-4" />,
        },
        CANCELLED: {
          bg: "bg-red-50",
          text: "text-red-600",
          icon: <AlertCircle className="h-4 w-4" />,
        },
      };

      const config = statusConfig[transaction.status];

      return (
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 ${config.bg} ${config.text}`}
        >
          {config.icon}
          <span className="text-sm font-medium">
            {SCHEDULED_TRANSACTION_STATUS_LABELS[transaction.status]}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      const subCategory = row.original.subCategory;

      return (
        <div className="flex flex-col space-y-1">
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

          {subCategory && (
            <div
              className="ml-2 flex items-center gap-2 rounded-full px-3 py-1"
              style={{
                backgroundColor: `${subCategory.color}10`,
                color: subCategory.color,
              }}
            >
              <Tag className="h-3 w-3" style={{ color: subCategory.color }} />
              <span className="text-xs font-medium">{subCategory.name}</span>
            </div>
          )}
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
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-gray-600">
            <CreditCard className="h-4 w-4" />
            <span className="text-sm font-medium">
              {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
            </span>
          </div>

          {transaction.creditCard &&
            transaction.paymentMethod === "CREDIT_CARD" && (
              <div className="ml-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {transaction.creditCard.name} ({transaction.creditCard.brand})
                </span>
              </div>
            )}
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
    cell: ({ row: { original: scheduledTransaction } }) => {
      const amount = Number(scheduledTransaction.amount);
      const isExpense = scheduledTransaction.type === "EXPENSE";

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
    accessorKey: "recurrence",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Recorrência" />
    ),
    cell: ({ row: { original: scheduledTransaction } }) => {
      if (
        !scheduledTransaction.isRecurring ||
        !scheduledTransaction.recurrenceType
      ) {
        return (
          <Badge variant="outline" className="text-gray-500">
            Única
          </Badge>
        );
      }

      const intervalText =
        scheduledTransaction.recurrenceInterval &&
        scheduledTransaction.recurrenceInterval > 1
          ? `${scheduledTransaction.recurrenceInterval} `
          : "";

      return (
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600">
          <Repeat className="h-4 w-4" />
          <span className="text-sm font-medium">
            {intervalText}
            {RECURRENCE_TYPE_LABELS[scheduledTransaction.recurrenceType]}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "dateRange",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Período" />
    ),
    cell: ({ row: { original: transaction } }) => {
      const formatDate = (date: Date | null | undefined) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };

      return (
        <div className="flex flex-col space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Início: {formatDate(transaction.startDate)}</span>
          </div>

          {transaction.endDate && (
            <div className="flex items-center gap-1">
              <CalendarRange className="h-4 w-4 text-gray-500" />
              <span>Fim: {formatDate(transaction.endDate)}</span>
            </div>
          )}

          {transaction.lastExecutionDate && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-blue-600">
                Última execução: {formatDate(transaction.lastExecutionDate)}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row: { original: transaction } }) => {
      if (!transaction.description) return null;

      return (
        <div className="max-w-xs truncate text-sm text-gray-500">
          {transaction.description}
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: transaction } }) => {
      return (
        <div className="flex items-center space-x-2">
          <EditScheduledTransactionButton scheduledTransaction={transaction} />
          <DeleteScheduledTransactionButton
            scheduledTransactionId={transaction.id}
          />
        </div>
      );
    },
  },
];
