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
import {
  AppWindow,
  Palette,
  Calendar,
  Target,
  Edit,
  DollarSign,
  CheckCircle,
  Info,
  Clock,
} from "lucide-react";
import { useToast } from "../_hooks/use-toast";

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

const GOAL_STATUS_OPTIONS = [
  { value: GoalStatus.IN_PROGRESS, label: "Em progresso" },
  { value: GoalStatus.COMPLETED, label: "Concluída" },
  { value: GoalStatus.CANCELLED, label: "Cancelada" },
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
  const { toast } = useToast();

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
        color: colorRef.current || data.color,
        icon: selectedIcon || data.icon,
        goalAmount: Number(data.goalAmount),
        currentAmount: Number(data.currentAmount),
        id: goalId,
      };

      await upsertGoal(dataToSubmit);
      toast({
        title: `✅ Meta ${isUpdate ? "atualizada" : "adicionada"} com sucesso`,
      });
      setIsOpen(false);
      colorRef.current = "";
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar a meta:", error);
      toast({
        title: "Erro ao salvar a meta",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
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
      <DialogContent
        className="overflow-hidden border-none p-0 shadow-lg sm:max-w-md"
        style={{ borderRadius: "20px" }}
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-500 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Target className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Nova"} Meta
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "criar"} sua meta financeira
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
                      <div className="space-y-3">
                        <div className="relative">
                          <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
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
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione um nome" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-none shadow-lg">
                              {predefinedNames.map((name) => (
                                <SelectItem
                                  key={name}
                                  value={name}
                                  className="cursor-pointer hover:bg-blue-50"
                                >
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {showCustomName && (
                          <div className="relative">
                            <Edit className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <Input
                              placeholder="Digite o nome da meta..."
                              onChange={field.onChange}
                              className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Descrição
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Info className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          placeholder="Digite a descrição da meta..."
                          {...field}
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="goalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Valor da Meta
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <MoneyInput
                            placeholder="Digite o valor da meta..."
                            value={field.value}
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue || 0)
                            }
                            onBlur={field.onBlur}
                            disabled={field.disabled}
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
                  name="currentAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Valor Inicial
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <MoneyInput
                            placeholder="Digite o valor inicial..."
                            value={field.value}
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue || 0)
                            }
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Data Alvo
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          {GOAL_STATUS_OPTIONS.map((option) => (
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
              </div>

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
                              Selecione uma cor para personalizar sua meta
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
                                Escolha o ícone que melhor combine com sua meta
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
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-gray-800 to-gray-500 text-white hover:from-gray-500 hover:to-gray-200"
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

export default UpsertGoalDialog;
