"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MoneyInput } from "./money-input";
import { upsertGoal } from "../_actions/upsert-goal";
import { GoalStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DatePicker } from "./ui/date-picker";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import ColorPicker from "@/app/_components/ui/color-picker";
import { IconPicker } from "./ui/icon-picker";
import { IconRenderer } from "./ui/icon-renderer";
import { useRef, useState } from "react";
import { AppWindow, GoalIcon, Palette } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "A descrição é obrigatória." }),
  status: z.nativeEnum(GoalStatus, {
    required_error: "O status é obrigatório.",
  }),
  targetDate: z.date({ required_error: "A data é obrigatória." }),
  goalAmount: z.number({ required_error: "O valor da meta é obrigatório." }),
  currentAmount: z.number({
    required_error: "O valor inicial é obrigatório.",
  }),
  color: z.string().min(1, { message: "A cor é obrigatória." }),
  icon: z.string().min(1, { message: "O caminho do ícone é obrigatório." }),
});

interface UpsertGoalDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  goalId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

type FormSchema = z.infer<typeof formSchema>;

const predefinedNames = [
  "Sonho sobre rodas",
  "Saúde e bem-estar",
  "Meu fundo de segurança",
  "Aposentadoria tranquila",
  "Momentos para celebrar",
  "Meu lar ideal",
  "Viagem dos sonhos",
  "Reforma da casa",
  "Tecnologia nova",
  "Futuro dos meus filhos e família",
  "Abrindo meu próprio negócio",
  "Investindo no meu futuro",
  "Minha próxima conquista",
  "Primeiro milhão",
  "Ajudando quem precisa",
  "Outro",
];

const UpsertGoalDialog = ({
  isOpen,
  defaultValues,
  goalId,
  setIsOpen,
}: UpsertGoalDialogProps) => {
  const [selectedName, setSelectedName] = useState<string>("");
  const [showCustomName, setShowCustomName] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("");
  const [openIconDialog, setOpenIconDialog] = useState(false);
  const colorRef = useRef("");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
      description: "",
      status: GoalStatus.IN_PROGRESS,
      targetDate: new Date(),
      goalAmount: 0,
      currentAmount: 0,
      color: "#000000",
      icon: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const dataToSubmit = {
        ...data,
        color: colorRef.current,
        icon: selectedIcon,
        goalAmount: Number(data.goalAmount),
        currentAmount: Number(data.currentAmount),
        id: goalId,
      };

      await upsertGoal(dataToSubmit);
      setIsOpen(false);
      colorRef.current = "";
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar a meta:", error);
    }
  };

  const isUpdate = Boolean(goalId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-5 text-2xl font-bold">
            {isUpdate ? "Atualizar" : "Adicionar"} Meta <GoalIcon />
          </DialogTitle>
          <DialogDescription className="bg-background">
            Preencha as informações abaixo para{" "}
            {isUpdate ? "atualizar" : "criar"} sua meta.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-6">
                      <Select
                        value={selectedName}
                        onValueChange={(value) => {
                          setSelectedName(value);
                          if (value === "Outro") {
                            setShowCustomName(true);
                          } else {
                            setShowCustomName(false);
                            field.onChange(value);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione um nome" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedNames.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {showCustomName && (
                        <Input
                          placeholder="Digite o nome da meta..."
                          onChange={field.onChange}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite a descrição da meta..."
                      {...field}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="goalAmount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-sm font-medium">
                      Valor da Meta
                    </FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Digite o valor da meta..."
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue || 0)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="block text-sm font-medium">
                      Valor Inicial
                    </FormLabel>
                    <FormControl>
                      <MoneyInput
                        placeholder="Digite o valor inicial..."
                        value={field.value}
                        onValueChange={({ floatValue }) =>
                          field.onChange(floatValue || 0)
                        }
                        onBlur={field.onBlur}
                        disabled={field.disabled}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium">
                      <strong>Data</strong>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-sm text-red-500" />
                  </FormItem>
                )}
              />

              <div className="mt-7 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4">
                    <DialogTitle className="text-lg font-semibold">
                      Selecione a cor
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Escolha uma cor para sua meta.
                    </DialogDescription>
                    <ColorPicker
                      onChange={(color) => {
                        const hexColor = `#${color.hex}`;
                        colorRef.current = hexColor;
                        form.setValue("color", hexColor);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <Dialog open={openIconDialog} onOpenChange={setOpenIconDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {selectedIcon ? (
                        <IconRenderer icon={selectedIcon} className="h-4 w-4" />
                      ) : (
                        <AppWindow className="h-4 w-4" />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        Selecione o ícone
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Escolha o ícone que melhor combine com sua meta.
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
            </div>

            {/* Rodapé do Formulário */}
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline" className="mr-2">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="hover:bg-primary-dark bg-primary"
              >
                {isUpdate ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertGoalDialog;
