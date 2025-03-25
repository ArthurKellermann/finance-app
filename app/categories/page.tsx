"use client";

import { useEffect, useState } from "react";
import type { Category, TransactionType } from "@prisma/client";
import { DataTable } from "./_columns/data-table/data-table";
import AddCategoryButton from "./_components/add-category-button";
import getDefaultCategories from "../_actions/get-default-categories";
import { getColumns } from "./_columns/data-table/columns";
import type { ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@clerk/nextjs";

const CategoriesPage = () => {
  const { userId } = useAuth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchCategories = async () => {
    try {
      const data = await getDefaultCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [userId]);

  const columns = getColumns({
    refreshData: fetchCategories,
    expandedRows,
    toggleExpand,
  }) as ColumnDef<{
    userId: string | null;
    name: string;
    id: string;
    isDefault: boolean;
    icon: string;
    color: string;
    type: TransactionType;
    createdAt: Date;
    updatedAt: Date;
  }>[];

  return (
    <div className="flex flex-col space-y-6 overflow-hidden p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <div className="flex items-center gap-3">
          <AddCategoryButton onSuccess={fetchCategories} />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        onCategoriesChange={setCategories}
        refreshData={fetchCategories}
        expandedRows={expandedRows}
        toggleExpand={toggleExpand}
      />
    </div>
  );
};

export default CategoriesPage;
