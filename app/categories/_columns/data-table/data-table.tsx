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
    <div className="mt-4 space-y-4">
      <DataTableToolbar
        table={table}
        removeDeletedRows={removeDeletedRows}
        refreshData={refreshData}
      />
      <div className="overflow-y-auto rounded-md border">
        <Table className="bg-card">
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
              table.getRowModel().rows.flatMap((row) => {
                const category = row.original;
                const isExpanded = expandedRows[category.id];

                return [
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                        className="bg-muted/50 hover:bg-muted/30"
                      >
                        <TableCell></TableCell>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell></TableCell>

                        <TableCell>
                          <div className="space-x-1">
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
                  className="h-24 text-center"
                >
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
