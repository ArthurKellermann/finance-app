import { ChevronRight, ChevronDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
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
  expandedRows,
  toggleExpand,
}: {
  refreshData: () => void;
  expandedRows: Record<string, boolean>;
  toggleExpand: (id: string) => void;
}): ColumnDef<CategoryWithSubCategory>[] => [
  {
    id: "expand",
    header: " ",
    cell: ({ row: { original: category } }) => {
      const hasSubCategories = category.subCategories?.length > 0;
      return hasSubCategories ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(category.id);
          }}
          className="flex h-6 w-6 items-center justify-center rounded hover:bg-accent"
        >
          {expandedRows[category.id] ? (
            <ChevronDown className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </button>
      ) : (
        <div className="h-6 w-6" />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: category } }) => (
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
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row: { original: category } }) => (
      <span className="font-bold">
        {TRANSACTION_TYPE_OPTIONS.find(
          (option) => option.value === category.type,
        )?.label || category.type}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: category } }) => (
      <div className="space-x-1">
        <AddSubCategoryButton
          categoryId={category.id}
          onSuccess={refreshData}
        />
        {!category.isDefault && (
          <EditCategoryButton category={category} onSuccess={refreshData} />
        )}

        {!category.isDefault && (
          <DeleteCategoryButton
            categoryId={category.id}
            onDeleteSuccess={refreshData}
          />
        )}
      </div>
    ),
  },
];
