"use client";

import { useEffect, useState } from "react";
import type { Category, TransactionType } from "@prisma/client";
import { DataTable } from "./_columns/data-table/data-table";
import getDefaultCategories from "../_actions/get-default-categories";
import { getColumns } from "./_columns/data-table/columns";
import type { ColumnDef } from "@tanstack/react-table";
import { useAuth } from "@clerk/nextjs";
import { TRANSACTION_CATEGORY_LABELS } from "../_constants/transactions";
import { Menu } from "lucide-react";
import AddCategoryButton from "./_components/add-category-button";

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
      const formattedCategories = data.map((category) => ({
        ...category,
        name:
          TRANSACTION_CATEGORY_LABELS[
            category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
          ] || category.name,
      }));
      setCategories(formattedCategories || []);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        <div className="overflow-hidden rounded-xl shadow-lg">
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <Menu className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Categorias</h1>
                <p className="text-sm">
                  Visão completa de seus movimentos financeiros
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <AddCategoryButton onSuccess={fetchCategories} />
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns}
              data={categories}
              onCategoriesChange={setCategories}
              refreshData={fetchCategories}
              expandedRows={expandedRows}
              toggleExpand={toggleExpand}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
