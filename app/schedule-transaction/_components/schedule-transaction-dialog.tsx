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
import { MoneyInput } from "@/app/_components/money-input";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
  RECURRENCE_OPTIONS,
} from "@/app/_constants/transactions";
import { DatePicker } from "@/app/_components/ui/date-picker";
import { z } from "zod";
import {
  TransactionType,
  TransactionPaymentMethod,
  RecurrenceType,
  type Category,
  type SubCategory,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleTransaction } from "../_actions/schedule-transaction";
import { useEffect, useState } from "react";
import getDefaultCategories from "@/app/_actions/get-default-categories";
import getCreditCards from "@/app/_actions/get-credit-cards";
import { useAuth } from "@clerk/nextjs";
import { getSubCategoriesByCategoryId } from "@/app/_actions/get-sub-categories-by-category-id";
import {
  AlertCircle,
  Calendar,
  CalendarClock,
  CheckCircle,
  CreditCard,
  DollarSign,
  Repeat,
  Tag,
  Wallet,
} from "lucide-react";
import { useToast } from "@/app/_hooks/use-toast";

interface ScheduleTransactionDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  scheduledTransactionId?: string;
  setIsOpen: (isOpen: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, {
    message: "O nome é obrigatório.",
  }),
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  type: z.nativeEnum(TransactionType, {
    required_error: "O tipo é obrigatório.",
  }),
  categoryId: z
    .string({
      message: "A categoria é obrigatória.",
    })
    .uuid(),
  subCategoryId: z.string().uuid().optional(),
  paymentMethod: z.nativeEnum(TransactionPaymentMethod, {
    required_error: "O método de pagamento é obrigatório.",
  }),
  startDate: z.date({
    required_error: "A data de início é obrigatória.",
  }),
  endDate: z.date().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceType: z.nativeEnum(RecurrenceType).optional(),
  recurrenceInterval: z.number().positive().optional(),
  hasEndDate: z.boolean().default(false),
  creditCardId: z.string().uuid().optional(),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const ScheduleTransactionDialog = ({
  isOpen,
  defaultValues,
  scheduledTransactionId,
  setIsOpen,
}: ScheduleTransactionDialogProps) => {
  const { userId } = useAuth();

  const [defaultCategories, setDefaultCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [creditCards, setCreditCards] = useState<
    { id: string; description: string; userId: string }[]
  >([]);

  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      amount: 50,
      categoryId: defaultCategories[0]?.id,
      startDate: new Date(),
      name: "",
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
      isRecurring: false,
      hasEndDate: false,
    },
  });

  const { watch } = form;
  const categoryId = watch("categoryId");
  const isRecurring = watch("isRecurring");
  const hasEndDate = watch("hasEndDate");

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getDefaultCategories();
      if (categories) {
        setDefaultCategories(categories);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategoriesForCategory = async () => {
      const subs = await getSubCategoriesByCategoryId(categoryId);
      setSubCategories(subs || []);
    };

    if (categoryId) {
      fetchSubCategoriesForCategory();
    }
  }, [categoryId]);

  useEffect(() => {
    const fetchCreditCards = async () => {
      if (!userId) {
        return null;
      }
      const cards = await getCreditCards({ userId });
      if (cards) {
        const formattedCards = cards.map((card) => ({
          id: card.id,
          description: card.description,
          userId: card.userId,
        }));
        setCreditCards(formattedCards);
      }
    };

    fetchCreditCards();
  }, [userId]);

  useEffect(() => {
    if (isRecurring) {
      form.register("recurrenceType", {
        required: "O tipo de recorrência é obrigatório",
      });
      form.register("recurrenceInterval", {
        required: "O intervalo é obrigatório",
      });
    }

    if (hasEndDate) {
      form.register("endDate", { required: "A data final é obrigatória" });
    }
  }, [isRecurring, hasEndDate, form]);

  const onSubmit = async (data: FormSchema) => {
    try {
      if (unableToSelectCreditCard()) {
        return;
      }

      if (!data.hasEndDate) {
        data.endDate = undefined;
      }

      if (!data.isRecurring) {
        data.recurrenceType = undefined;
        data.recurrenceInterval = undefined;
      }

      await scheduleTransaction({ ...data, id: scheduledTransactionId });
      toast({
        title: "✅ Transação programada com sucesso",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Erro ao programar transação",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const isUpdate = Boolean(scheduledTransactionId);
  const paymentMethod = form.watch("paymentMethod");
  const showCreditCardField =
    paymentMethod === TransactionPaymentMethod.CREDIT_CARD;

  const unableToSelectCreditCard = () => {
    form.setValue("creditCardId", undefined);
    return showCreditCardField && form.getValues("type") !== "EXPENSE";
  };

  const currentCategoryHasSubCategories = subCategories.some(
    (subCategory) => subCategory.categoryId === form.watch("categoryId"),
  );

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
        className="overflow-y-auto border-none p-0 shadow-lg sm:max-w-2xl"
        style={{ borderRadius: "20px", maxHeight: "90vh" }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <CalendarClock className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Nova"} Transação Programada
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "programar"} sua transação
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <Input
                            placeholder="Digite o nome..."
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Valor
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                          <MoneyInput
                            className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                            placeholder="Digite o valor..."
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
                          <SelectTrigger className="rounded-lg border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
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

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Data de Início
                      </FormLabel>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </div>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Categoria
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione a categoria..." />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="max-h-60 rounded-lg border-none shadow-lg">
                          {defaultCategories.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={option.id}
                              className="cursor-pointer hover:bg-blue-50"
                            >
                              {TRANSACTION_CATEGORY_LABELS[
                                option.name as keyof typeof TRANSACTION_CATEGORY_LABELS
                              ] || option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {currentCategoryHasSubCategories && (
                  <FormField
                    control={form.control}
                    name="subCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Sub Categoria
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <div className="relative">
                              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                              <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                                <SelectValue placeholder="Selecione a sub categoria..." />
                              </SelectTrigger>
                            </div>
                          </FormControl>
                          <SelectContent className="rounded-lg border-none shadow-lg">
                            {subCategories
                              .filter(
                                (option) =>
                                  option.categoryId ===
                                  form.watch("categoryId"),
                              )
                              .map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id}
                                  className="cursor-pointer hover:bg-blue-50"
                                >
                                  {option.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Método de pagamento
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="relative">
                            <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                              <SelectValue placeholder="Selecione um método de pagamento..." />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          {TRANSACTION_PAYMENT_METHOD_OPTIONS.map((option) => (
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

                {showCreditCardField &&
                  form.getValues("type") === "EXPENSE" && (
                    <FormField
                      control={form.control}
                      name="creditCardId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">
                            Cartão de Crédito
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                                  <SelectValue placeholder="Selecione o cartão..." />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="rounded-lg border-none shadow-lg">
                              {creditCards.map((card) => (
                                <SelectItem
                                  key={card.id}
                                  value={card.id}
                                  className="cursor-pointer hover:bg-blue-50"
                                >
                                  {card.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  )}
              </div>

              {unableToSelectCreditCard() && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                  <p className="text-sm text-yellow-800">
                    Para selecionar um cartão de crédito, selecione o tipo de
                    transação como despesa.
                  </p>
                </div>
              )}

              <FormField
                control={form.control}
                name="isRecurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium text-gray-700">
                        Transação Recorrente
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        Marque esta opção para configurar uma transação que se
                        repete
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {isRecurring && (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="recurrenceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">
                            Tipo de Recorrência
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <div className="relative">
                                <Repeat className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <SelectTrigger className="rounded-lg border-gray-200 pl-10 focus:border-blue-500">
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent className="rounded-lg border-none shadow-lg">
                              {RECURRENCE_OPTIONS.map((option) => (
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

                    <FormField
                      control={form.control}
                      name="recurrenceInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">
                            Intervalo
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Repeat className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                              <Input
                                type="number"
                                min="1"
                                placeholder="Digite o intervalo..."
                                className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="hasEndDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-200 p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-medium text-gray-700">
                            Definir Data Final
                          </FormLabel>
                          <p className="text-sm text-gray-500">
                            Marque esta opção para definir quando a recorrência
                            terminará
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {hasEndDate && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-medium text-gray-700">
                              Data Final
                            </FormLabel>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                            </div>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </>
              )}

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Descrição (opcional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Adicione detalhes sobre esta transação programada..."
                        className="rounded-lg border-gray-200 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

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
                  {isUpdate ? "Atualizar" : "Programar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTransactionDialog;
