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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Banks, CreditCardStatus, CreditCardType } from "@prisma/client";
import {
  CREDIT_CARD_TYPE_LABELS,
  CREDIT_CARD_STATUS_LABELS,
  BANK_LABELS,
} from "../_constants/credit-cards";
import { upsertCreditCard } from "../_actions/upsert-credit-card";
import { MoneyInput } from "./money-input";
import {
  CreditCard,
  Tag,
  DollarSign,
  Calendar,
  Banknote,
  CheckCircle,
  PieChart,
  AlertCircle,
} from "lucide-react";
import { useToast } from "../_hooks/use-toast";

interface UpsertCreditCardDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  creditCardId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, { message: "A descrição é obrigatória." }),
  limit: z
    .number()
    .positive({ message: "O limite deve ser um valor positivo." })
    .min(1, { message: "O limite deve ser maior que zero." }),
  type: z.nativeEnum(CreditCardType, {
    required_error: "O tipo é obrigatório.",
  }),
  bank: z.nativeEnum(Banks, {
    required_error: "O banco é obrigatório.",
  }),
  status: z.nativeEnum(CreditCardStatus, {
    required_error: "O status é obrigatório.",
  }),
  spent: z.number().min(0, { message: "O gasto deve ser um valor positivo." }),
  statementCloseDay: z
    .string()
    .min(1)
    .max(31, { message: "O dia de fechamento deve estar entre 1 e 31." }),
  dueDay: z
    .string()
    .min(1)
    .max(31, { message: "O dia de vencimento deve estar entre 1 e 31." }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertCreditCardDialog = ({
  isOpen,
  defaultValues,
  creditCardId,
  setIsOpen,
}: UpsertCreditCardDialogProps) => {
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      description: "",
      limit: 0,
      spent: 0,
      type: CreditCardType.VISA,
      bank: Banks.ITAU,
      status: CreditCardStatus.ACTIVE,
      statementCloseDay: "10",
      dueDay: "20",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertCreditCard({ ...data, id: creditCardId });
      toast({
        title: "✅ Cartão de crédito salvo com sucesso",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar o cartão de crédito:", error);
      toast({
        title: "❌ Erro ao salvar o cartão de crédito",
        variant: "destructive",
      });
    }
  };

  const isUpdate = Boolean(creditCardId);

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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <CreditCard className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Novo"} Cartão de Crédito
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "adicionar"} seu cartão de crédito
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          placeholder="Digite a descrição..."
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                          {...field}
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
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Limite
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <MoneyInput
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            placeholder="Digite o limite..."
                            value={field.value}
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue)
                            }
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="spent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Gasto Atual
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <PieChart className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <MoneyInput
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            placeholder="Digite o gasto atual..."
                            value={field.value}
                            onValueChange={({ floatValue }) =>
                              field.onChange(floatValue)
                            }
                            onBlur={field.onBlur}
                            disabled={field.disabled}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Tipo
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione o tipo..." />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          {Object.entries(CREDIT_CARD_TYPE_LABELS).map(
                            ([value, label]) => (
                              <SelectItem
                                key={value}
                                value={value}
                                className="cursor-pointer hover:bg-blue-50"
                              >
                                {label}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Banco
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione o banco..." />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          {Object.entries(BANK_LABELS).map(([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

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
                          <AlertCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                            <SelectValue placeholder="Selecione o status..." />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent className="rounded-lg border-none shadow-lg">
                        {Object.entries(CREDIT_CARD_STATUS_LABELS).map(
                          ([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="statementCloseDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Dia de Fechamento
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <Input
                            type="string"
                            placeholder="Digite o dia..."
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Dia de Vencimento
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <Input
                            type="string"
                            placeholder="Digite o dia..."
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
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
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
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

export default UpsertCreditCardDialog;
