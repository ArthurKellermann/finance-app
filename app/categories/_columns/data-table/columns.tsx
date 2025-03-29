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
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-blue-100"
        >
          {expandedRows[category.id] ? (
            <ChevronDown className="h-5 w-5 text-blue-600" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-600" />
          )}
        </button>
      ) : (
        <div className="h-8 w-8" />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original: category } }) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 shadow-sm">
          <IconRenderer
            icon={category.icon}
            style={{ height: "1.4rem", width: "1.4rem", color: category.color }}
          />
        </div>
        <span className="font-medium text-gray-800">
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
    cell: ({ row: { original: category } }) => {
      const typeOption = TRANSACTION_TYPE_OPTIONS.find(
        (option) => option.value === category.type,
      );
      const typeLabel = typeOption?.label || category.type;

      let bgColor = "bg-gray-100";
      let textColor = "text-gray-800";

      if (category.type === "EXPENSE") {
        bgColor = "bg-red-50";
        textColor = "text-red-600";
      } else if (category.type === "DEPOSIT") {
        bgColor = "bg-green-50";
        textColor = "text-green-600";
      } else if (category.type === "INVESTMENT") {
        bgColor = "bg-purple-50";
        textColor = "text-purple-600";
      }

      return (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${bgColor} ${textColor}`}
        >
          {typeLabel}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row: { original: category } }) => (
      <div className="flex items-center space-x-2">
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
