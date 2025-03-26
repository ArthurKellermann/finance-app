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
} from "../_constants/transactions";
import { DatePicker } from "./ui/date-picker";
import { z } from "zod";
import {
  TransactionType,
  TransactionPaymentMethod,
  type SubCategory,
  type Category,
} from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertTransaction } from "../_actions/upsert-transaction";
import { useEffect, useState } from "react";
import getDefaultCategories from "../_actions/get-default-categories";
import { ArrowUp } from "lucide-react";
import { useToast } from "../_hooks/use-toast";
import { getSubCategoriesByCategoryId } from "../_actions/get-sub-categories-by-category-id";

interface AddRevenueDialogProps {
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
  categoryId: z.string().uuid(),
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

const AddRevenueDialog = ({
  isOpen,
  defaultValues,
  transactionId,
  setIsOpen,
}: AddRevenueDialogProps) => {
  const [defaultCategories, setDefaultCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      amount: 50,
      categoryId: defaultCategories[0]?.id,
      date: new Date(),
      name: "",
      paymentMethod: TransactionPaymentMethod.CASH,
    },
  });

  const { watch } = form;
  const categoryId = watch("categoryId");

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getDefaultCategories();

      const expenseTypeCategories = categories.filter(
        (category) => category.type === TransactionType.DEPOSIT,
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

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertTransaction({
        ...data,
        id: transactionId,
        type: TransactionType.DEPOSIT,
      });
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

  const availablePaymentMethods = TRANSACTION_PAYMENT_METHOD_OPTIONS.filter(
    (pm) => pm.value !== TransactionPaymentMethod.CREDIT_CARD,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              {isUpdate ? "Atualizar" : "Criar"} receita <ArrowUp />
            </div>
          </DialogTitle>
          <DialogDescription>Insira as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <MoneyInput
                      placeholder="Digite o valor..."
                      value={field.value}
                      onValueChange={({ floatValue }) =>
                        field.onChange(floatValue)
                      }
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {defaultCategories.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {TRANSACTION_CATEGORY_LABELS[
                            option.name as keyof typeof TRANSACTION_CATEGORY_LABELS
                          ] || option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentCategoryHasSubCategories && (
              <FormField
                control={form.control}
                name="subCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a sub categoria..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subCategories
                          .filter(
                            (option) =>
                              option.categoryId === form.watch("categoryId"),
                          )
                          .map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de pagamento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um método de pagamento..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availablePaymentMethods.map((option) => (
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
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

export default AddRevenueDialog;
