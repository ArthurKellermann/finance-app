"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DataTable } from "@/app/_components/ui/data-table";
import { Button } from "../../_components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../_components/ui/dialog";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import DeleteCategoryButton from "./delete-category-button";
import { ColumnDef } from "@tanstack/react-table";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { Input } from "@/app/_components/ui/input";
import { PlusIcon, CheckIcon, Palette, AppWindow } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";
import ColorPicker from "@/app/_components/ui/color-picker";
import { IconPicker } from "@/app/_components/ui/icon-picker";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import { useAuth } from "@clerk/nextjs";
import { createCategory } from "../../_actions/create-category";
import { findCategoryByName } from "../../_actions/find-category-by-name";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";

const EditCategoryDialog = () => {
  const { userId } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [openIconDialog, setOpenIconDialog] = useState(false);
  const [selected, setSelected] = useState<null | string>(null);
  const [categories, setCategories] = useState<
    { value: string; categoryId: string; color: string; icon: string }[]
  >([]);
  const colorRef = useRef("");

  useEffect(() => {
    const fetchDefaultCategories = async () => {
      const fetchedCategories = await getDefaultCategories();
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
    };
    fetchDefaultCategories();
  }, []);

  const handleAddCategory = useCallback(async () => {
    if (!userId) {
      return;
    }

    if (selected === null) {
      return;
    }

    const data = {
      userId: userId,
      name: newCategory,
      isDefault: false,
      color: colorRef.current,
      icon: selected,
    };

    const existingCategory = await findCategoryByName({
      userId,
      name: newCategory,
    });

    if (existingCategory) {
      toast.error("Essa categoria já existe. Por favor, escolha outra.");
      return;
    }

    try {
      const newCategoryData = await createCategory(data);

      setCategories((prev) => [
        ...prev,
        {
          value: newCategory,
          categoryId: newCategoryData.categoryId,
          color: colorRef.current,
          icon: selected,
        },
      ]);

      setNewCategory("");
      setSelected(null);
      colorRef.current = "";
      setIsAdding(false);

      toast.success("Categoria criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar categoria");
      console.error(error);
    }
  }, [userId, newCategory, selected]);

  const handleDeleteCategory = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.filter((category) => category.categoryId !== categoryId),
    );
  }, []);

  const data = categories.map((category) => ({
    id: category.categoryId,
    name: category.value,
    color: category.color,
    icon: category.icon,
  }));

  const categoryColumns: ColumnDef<{
    id: string;
    name: string;
    color: string;
    icon: string;
  }>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row: { original: category } }) => {
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <span>
              {TRANSACTION_CATEGORY_LABELS[
                category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
              ] || category.name}
            </span>
            <IconRenderer
              icon={category.icon}
              style={{ height: "1.2rem", width: "1.2rem" }}
            />
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
                <Popover>
                  <PopoverTrigger>
                    <Button variant="link" className="text-primary">
                      <Palette className="h-6 w-6 text-primary" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto bg-card p-4" side="right">
                    <DialogTitle>Selecione a cor</DialogTitle>
                    <DialogDescription>
                      Escolha uma cor para sua categoria.
                    </DialogDescription>

                    <ColorPicker
                      onChange={(color) => {
                        const hexColor = `#${color.hex}`;
                        colorRef.current = hexColor;
                        console.log("Selected color:", hexColor);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Dialog
                  open={openIconDialog}
                  onOpenChange={(e) => setOpenIconDialog(e)}
                >
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-primary">
                      {selected ? (
                        <Button variant="outline" className="w-10">
                          <IconRenderer
                            icon={selected}
                            style={{ height: "1.5rem", width: "1.5rem" }}
                          />
                        </Button>
                      ) : (
                        <AppWindow className="h-6 w-6 text-primary" />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Selecione o ícone</DialogTitle>
                      <DialogDescription>
                        Escolha o ícone que melhor combine com sua categoria
                      </DialogDescription>
                    </DialogHeader>
                    <IconPicker
                      onChange={(icon) => {
                        setSelected(icon);
                        setOpenIconDialog(false);
                        console.log({ icon });
                      }}
                    />
                  </DialogContent>
                </Dialog>
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
          <DeleteCategoryButton
            categoryId={category.id}
            onDeleteSuccess={() => handleDeleteCategory(category.id)}
          />
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
        <DialogContent className="w-full max-w-4xl rounded-lg bg-card p-6 shadow-lg">
          <DialogHeader>
            <div>
              <DialogTitle className="text-xl font-semibold">
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
