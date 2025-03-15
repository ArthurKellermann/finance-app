"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

import { useEffect, useState } from "react";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
} from "@/app/_constants/transactions";
import { Button } from "@/app/_components/ui/button";
import { PiggyBankIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import ExportDataFromTransactionDialog from "../_components/export-data-from-transaction-table-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [categories, setCategories] = useState<
    { categoryId: string; value: string; color: string; icon: string }[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string | "">("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | ""
  >("");

  const [selectedName, setSelectedName] = useState<string | "">("");

  const [filterByDeposit, setFilterByDeposit] = useState(false);
  const [filterByExpense, setFilterByExpense] = useState(false);
  const [filterByInvestment, setFilterByInvestment] = useState(false);

  useEffect(() => {
    async function fetchFilterData() {
      const categories = await getDefaultCategories();
      if (categories) {
        setCategories(categories);
      }
    }
    fetchFilterData();
  }, []);

  useEffect(() => {
    const filters: ColumnFiltersState = [];

    if (selectedCategory && selectedCategory !== "all") {
      filters.push({
        id: "category_name",
        value: selectedCategory,
      });
    }

    if (selectedPaymentMethod && selectedPaymentMethod !== "all") {
      filters.push({
        id: "payment_method",
        value: selectedPaymentMethod,
      });
    }

    const typeFilters: string[] = [];
    if (filterByDeposit) typeFilters.push("deposit");
    if (filterByExpense) typeFilters.push("expense");
    if (filterByInvestment) typeFilters.push("investment");

    if (typeFilters.length) {
      filters.push({
        id: "type",
        value: typeFilters,
      });
    }

    setColumnFilters(filters);
  }, [
    selectedCategory,
    selectedPaymentMethod,
    filterByDeposit,
    filterByExpense,
    filterByInvestment,
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="rounded-md border">
        <div className="flex items-center justify-end px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant={filterByDeposit ? "secondary" : "outline"}
              size="icon"
              onClick={() => setFilterByDeposit(!filterByDeposit)}
              className="rounded-md text-blue-400"
            >
              <TrendingUpIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={filterByExpense ? "secondary" : "outline"}
              size="icon"
              onClick={() => setFilterByExpense(!filterByExpense)}
              className="rounded-md text-red-500"
            >
              <TrendingDownIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={filterByInvestment ? "secondary" : "outline"}
              size="icon"
              onClick={() => setFilterByInvestment(!filterByInvestment)}
              className="rounded-md"
            >
              <PiggyBankIcon className="h-4 w-4" />
            </Button>
            <Select
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem
                    key={category.categoryId}
                    value={category.categoryId}
                  >
                    {TRANSACTION_CATEGORY_LABELS[
                      category.value as keyof typeof TRANSACTION_CATEGORY_LABELS
                    ] || category.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="search"
              value={selectedName}
              onChange={(event) => setSelectedName(event.target.value)}
              placeholder="Procurar por nome..."
              className="w-[200px] rounded-md"
            />

            <ExportDataFromTransactionDialog userCanExportData={true} />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhuma transação encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
