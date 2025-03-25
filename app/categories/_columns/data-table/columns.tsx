"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "./data-table-column-header";
import { Checkbox } from "@/app/_components/ui/checkbox";
import type { Category, SubCategory } from "@prisma/client";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";
import DeleteCategoryButton from "@/app/(home)/_components/delete-category-button";
import AddSubCategoryButton from "../../_components/add-sub-category-button";
import EditCategoryButton from "../../_components/edit-category-button";

type CategoryWithSubCategory = Category & {
  subCategories: SubCategory[];
};

export const getColumns = ({
  refreshData,
}: {
  refreshData: () => void;
}): ColumnDef<CategoryWithSubCategory>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: category } }) => {
      return (
        <div className="flex items-center gap-2">
          <IconRenderer
            icon={category.icon}
            style={{ height: "1.2rem", width: "1.2rem", color: category.color }}
          />
          <span>
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
  // {
  //   accessorKey: "sub_category",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Sub Categoria" />
  //   ),
  //   cell: ({ row: { original: category } }) => {
  //     return <strong>{category.subCategory.map((sc) => sc.name)}</strong>;
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row: { original: category } }) => {
      return (
        <span className="font-bold">
          {TRANSACTION_TYPE_OPTIONS.find(
            (option) => option.value === category.type,
          )?.label || category.type}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: category } }) => {
      return (
        <div className="space-x-1">
          <AddSubCategoryButton categoryId={category.id} />
          <EditCategoryButton category={category} onSuccess={refreshData} />
          {!category.isDefault && (
            <DeleteCategoryButton
              categoryId={category.id}
              onDeleteSuccess={refreshData}
            />
          )}
        </div>
      );
    },
  },
];
