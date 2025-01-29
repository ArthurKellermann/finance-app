"use client";

import { useEffect, useState, useCallback } from "react";
import { DataTable } from "@/app/_components/ui/data-table";
import { Button } from "../../../_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../_components/ui/dialog";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import DeleteCategoryButton from "./delete-category-button";
import { ColumnDef } from "@tanstack/react-table";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Input } from "@/app/_components/ui/input";
import { PlusIcon, CheckIcon, Palette } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import ColorPicker from "@/app/_components/ui/color-picker";
import { IconPickerDialog } from "@/app/_components/ui/icon-picker";

const EditCategoryDialog = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState<
    { value: string; categoryId: string }[]
  >([]);

  useEffect(() => {
    const fetchDefaultCategories = async () => {
      const fetchedCategories = await getDefaultCategories();
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
    };
    fetchDefaultCategories();
  }, []);

  const handleAddCategory = useCallback(() => {
    if (newCategory.trim()) {
      setCategories((prev) => [
        ...prev,
        { value: newCategory, categoryId: Math.random().toString() },
      ]);
      setNewCategory("");
      setIsAdding(false);
    }
  }, [newCategory]);

  const data = categories.map((category) => ({
    id: category.categoryId,
    name: category.value,
  }));

  const categoryColumns: ColumnDef<{ id: string; name: string }>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row: { original: category } }) => {
        return (
          <div>
            {TRANSACTION_CATEGORY_LABELS[
              category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
            ] || category.name}
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => (
        <div className="flex items-center justify-end">
          {isAdding ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary">
                      <Palette className="h-6 w-6 text-primary" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="w-auto bg-white">
                    <DialogTitle>Selecione a cor</DialogTitle>
                    <DialogDescription>
                      Escolha uma cor para sua categoria.
                    </DialogDescription>
                    <div className="rounded-lg bg-white p-4">
                      <ColorPicker default_value="#1C9488" />
                    </div>
                  </DialogContent>
                </Dialog>

                <IconPickerDialog />
              </div>

              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
                className="bg-background-color-home border border-gray-300 p-2"
                placeholder="Nova categoria"
                autoFocus
              />
              <Button
                onClick={handleAddCategory}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold"
              >
                <CheckIcon className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold"
            >
              <PlusIcon className="h-5 w-5" />
            </Button>
          )}
        </div>
      ),
      cell: ({ row: { original: category } }) => (
        <div className="flex justify-end">
          <DeleteCategoryButton categoryId={category.id} />
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            onClick={() => setIsAdding(false)}
            variant="link"
            className="text-blue-600 transition duration-300 hover:text-blue-800"
          >
            Personalizar
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Personalizar categorias
              </DialogTitle>
              <DialogDescription>
                Crie e personalize as categorias de suas transações.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            <DataTable columns={categoryColumns} data={data} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditCategoryDialog;
