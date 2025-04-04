"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import type { Category, SubCategory } from "@prisma/client";
import DeleteSubCategoryButton from "../../_components/delete-sub-category-button";
import EditSubCategoryButton from "../../_components/edit-sub-category-button";

type CategoryWithSubs = Category & {
  subCategories?: SubCategory[];
};

interface DataTableProps<TData extends CategoryWithSubs> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onCategoriesChange?: (data: TData[]) => void;
  refreshData?: () => void;
  expandedRows: Record<string, boolean>;
  toggleExpand: (id: string) => void;
}

export function DataTable<TData extends CategoryWithSubs>({
  columns,
  data: initialData,
  onCategoriesChange,
  expandedRows,
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState<TData[]>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refreshData = async () => {
    try {
      const newData = (await getDefaultCategories()) as TData[];
      setData(newData || []);
      if (onCategoriesChange) {
        onCategoriesChange(newData || []);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setData([]);
      if (onCategoriesChange) {
        onCategoriesChange([]);
      }
    }
  };

  const removeDeletedRows = (ids: string[]) => {
    setData((prevData) => prevData.filter((row) => !ids.includes(row.id)));
  };

  const table = useReactTable({
    data,
    columns,
    meta: { refreshData },
    state: { sorting, columnVisibility, rowSelection, columnFilters },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="mt-6 space-y-6">
      <DataTableToolbar
        table={table}
        removeDeletedRows={removeDeletedRows}
        refreshData={refreshData}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-gray-50/80">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-4 font-semibold text-gray-700"
                  >
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
              table.getRowModel().rows.flatMap((row) => {
                const category = row.original;
                const isExpanded = expandedRows[category.id];

                return [
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>,
                  isExpanded &&
                    category.subCategories?.map((sub) => (
                      <TableRow
                        key={sub.id}
                        className="border-l-4 border-l-blue-200 bg-gray-50/70 hover:bg-blue-50/20"
                      >
                        <TableCell></TableCell>
                        <TableCell className="py-3 pl-10">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                            <span className="font-medium text-gray-700">
                              {sub.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell></TableCell>

                        <TableCell>
                          <div className="flex space-x-2">
                            <EditSubCategoryButton
                              subcategory={sub}
                              onSuccess={refreshData}
                            />
                            <DeleteSubCategoryButton
                              subcategoryId={sub.id}
                              onDeleteSuccess={refreshData}
                            />
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )),
                ];
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <p className="mb-1 text-lg font-medium">
                      Nenhuma categoria encontrada
                    </p>
                    <p className="text-sm">
                      Adicione categorias para organizar suas transações
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-b-xl border border-t-0 border-gray-200 bg-gray-50 p-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
