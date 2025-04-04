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
import { MoneyInput } from "./money-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { z } from "zod";
import {
  TransactionType,
  TransactionPaymentMethod,
  type Category,
  type SubCategory,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertTransaction } from "../_actions/upsert-transaction";
import { useEffect, useState } from "react";
import getDefaultCategories from "../_actions/get-default-categories";
import getCreditCards from "../_actions/get-credit-cards";
import { useAuth } from "@clerk/nextjs";
import {
  CreditCard,
  Calendar,
  Wallet,
  Tag,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "../_hooks/use-toast";
import { getSubCategoriesByCategoryId } from "../_actions/get-sub-categories-by-category-id";

interface AddExpenseDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  transactionId?: string;
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
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
  creditCardId: z.string().uuid().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

const AddExpenseDialog = ({
  isOpen,
  defaultValues,
  transactionId,
  setIsOpen,
}: AddExpenseDialogProps) => {
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
      date: new Date(),
      name: "",
      paymentMethod: TransactionPaymentMethod.CASH,
      type: TransactionType.EXPENSE,
    },
  });

  const { watch } = form;
  const categoryId = watch("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getDefaultCategories();

      const expenseTypeCategories = categories.filter(
        (category) =>
          category.type === TransactionType.EXPENSE ||
          category.type === TransactionType.INVESTMENT,
      );
      if (expenseTypeCategories) {
        setDefaultCategories(expenseTypeCategories);
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

  const onSubmit = async (data: FormSchema) => {
    try {
      if (unableToSelectCreditCard()) {
        return;
      }
      await upsertTransaction({ ...data, id: transactionId });
      toast({
        title: "✅ Receita adicionada com sucesso",
      });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isUpdate = Boolean(transactionId);

  const paymentMethod = form.watch("paymentMethod");
  const showCreditCardField =
    paymentMethod === TransactionPaymentMethod.CREDIT_CARD;

  const unableToSelectCreditCard = () => {
    form.setValue("creditCardId", undefined);
    return showCreditCardField && form.getValues("type") !== "EXPENSE";
  };

  const availableTypes = TRANSACTION_TYPE_OPTIONS.filter(
    (option) => option.value !== "DEPOSIT",
  );

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
        className="overflow-hidden border-none p-0 shadow-lg sm:max-w-md"
        style={{ borderRadius: "20px" }}
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <DollarSign className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Nova"} Despesa
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "registrar"} sua despesa
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
                          <SelectTrigger className="rounded-lg border-gray-200 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-lg border-none shadow-lg">
                          {availableTypes.map((option) => (
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Data
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
                                option.categoryId === form.watch("categoryId"),
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

              {showCreditCardField && form.getValues("type") === "EXPENSE" && (
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

              {unableToSelectCreditCard() && (
                <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
                  <p className="text-sm text-yellow-800">
                    Para selecionar um cartão de crédito, selecione o tipo de
                    transação como despesa.
                  </p>
                </div>
              )}

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
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-blue-600 hover:to-purple-600"
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

export default AddExpenseDialog;
