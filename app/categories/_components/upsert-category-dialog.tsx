import { Button } from "@/app/_components/ui/button";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertCategory } from "../_actions/upsert-category";
import { TransactionType } from "@prisma/client";
import { Palette, AppWindow } from "lucide-react";
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
  name: z.string().trim().min(1, { message: "O nome é obrigatória." }),
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
        title: `Categoria ${data.name} ${id ? "atualizada" : "criada"} com sucesso!`,
        variant: "default",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar categoria",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Atualizar" : "Adicionar"} Categoria
          </DialogTitle>
          <DialogDescription>Preencha as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-6">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cor</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-10 p-0"
                              >
                                <Palette className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto bg-card p-4">
                              <DialogTitle>Selecione a cor</DialogTitle>
                              <DialogDescription>
                                Escolha uma cor para sua categoria.
                              </DialogDescription>
                              <ColorPicker
                                onChange={(color) => {
                                  const hexColor = `#${color.hex}`;
                                  colorRef.current = hexColor;
                                  field.onChange(hexColor);
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          {selectedIcon ? (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-10 p-0"
                              onClick={() => setOpenIconDialog(true)}
                            >
                              <IconRenderer
                                icon={selectedIcon}
                                className="h-4 w-4"
                              />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-10 p-0"
                              onClick={() => setOpenIconDialog(true)}
                            >
                              <AppWindow className="h-4 w-4" />
                            </Button>
                          )}
                          <Dialog
                            open={openIconDialog}
                            onOpenChange={setOpenIconDialog}
                          >
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Selecione o ícone</DialogTitle>
                                <DialogDescription>
                                  Escolha o ícone que melhor combine com sua
                                  categoria
                                </DialogDescription>
                              </DialogHeader>
                              <IconPicker
                                onChange={(icon) => {
                                  setSelectedIcon(icon);
                                  field.onChange(icon);
                                  setOpenIconDialog(false);
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TRANSACTION_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="col-span-2 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">
                {isUpdate ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertCategoryDialog;
