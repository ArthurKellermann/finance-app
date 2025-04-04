"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertCategory } from "../_actions/upsert-category";
import { TransactionType } from "@prisma/client";
import {
  Palette,
  AppWindow,
  CheckCircle,
  Tag,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { useState, useRef } from "react";
import ColorPicker from "@/app/_components/ui/color-picker";
import { IconPicker } from "@/app/_components/ui/icon-picker";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { TRANSACTION_TYPE_OPTIONS } from "@/app/_constants/transactions";
import { useToast } from "@/app/_hooks/use-toast";

interface UpsertCategoryDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  id?: string;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  color: z.string().min(1, { message: "A cor é obrigatória." }),
  icon: z.string().min(1, { message: "O ícone é obrigatório." }),
  type: z.nativeEnum(TransactionType),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertCategoryDialog = ({
  isOpen,
  defaultValues,
  id,
  setIsOpen,
  onSuccess,
}: UpsertCategoryDialogProps) => {
  const [openIconDialog, setOpenIconDialog] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(defaultValues?.icon || "");
  const colorRef = useRef(defaultValues?.color || "#000000");
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      color: "#000000",
      icon: "",
      type: TransactionType.EXPENSE,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertCategory({
        ...data,
        color: colorRef.current,
        icon: selectedIcon,
        id,
      });

      setIsOpen(false);
      form.reset();
      setSelectedIcon("");
      colorRef.current = "#000000";

      toast({
        title: `✅ Categoria ${id ? "atualizada" : "adicionada"} com sucesso`,
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar categoria",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
      console.error("Erro ao salvar a categoria:", error);
    }
  };

  const isUpdate = Boolean(id);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setSelectedIcon("");
          colorRef.current = "#000000";
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        className="overflow-hidden border-none p-0 shadow-lg sm:max-w-md"
        style={{ borderRadius: "20px" }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Tag className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Nova"} Categoria
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "criar"} sua categoria
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          placeholder="Digite o nome da categoria..."
                          {...field}
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Tipo de Transação
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <div className="relative">
                          {field.value === TransactionType.DEPOSIT ? (
                            <ArrowUpCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          ) : (
                            <ArrowDownCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          )}
                          <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="rounded-lg border-none shadow-lg">
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="cursor-pointer hover:bg-blue-50"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="block font-medium text-gray-700">
                        Personalização
                      </FormLabel>
                      <div className="mt-1.5 flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex flex-1 items-center gap-2 rounded-lg border-gray-200 pl-3"
                            >
                              <div
                                className="h-4 w-4 rounded-full"
                                style={{
                                  backgroundColor:
                                    colorRef.current || field.value,
                                }}
                              />
                              <Palette className="h-4 w-4 text-gray-500" />
                              <span className="flex-1 text-left text-sm text-gray-600">
                                Cor
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto rounded-lg border-none p-4 shadow-lg">
                            <div className="mb-2 text-lg font-semibold">
                              Escolha uma cor
                            </div>
                            <div className="mb-3 text-sm text-gray-600">
                              Selecione uma cor para personalizar sua categoria
                            </div>
                            <ColorPicker
                              onChange={(color) => {
                                const hexColor = `#${color.hex}`;
                                colorRef.current = hexColor;
                                field.onChange(hexColor);
                              }}
                            />
                          </PopoverContent>
                        </Popover>

                        <Dialog
                          open={openIconDialog}
                          onOpenChange={setOpenIconDialog}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex flex-1 items-center gap-2 rounded-lg border-gray-200 pl-3"
                            >
                              {selectedIcon ? (
                                <IconRenderer
                                  icon={selectedIcon}
                                  className="h-4 w-4"
                                />
                              ) : (
                                <AppWindow className="h-4 w-4 text-gray-500" />
                              )}
                              <span className="flex-1 text-left text-sm text-gray-600">
                                Ícone
                              </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-lg border-none p-4 shadow-lg">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-semibold">
                                Selecione o ícone
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Escolha o ícone que melhor combine com sua
                                categoria
                              </DialogDescription>
                            </DialogHeader>
                            <IconPicker
                              onChange={(icon) => {
                                setSelectedIcon(icon);
                                form.setValue("icon", icon);
                                setOpenIconDialog(false);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="mt-6 flex gap-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 rounded-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  {isUpdate ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertCategoryDialog;
