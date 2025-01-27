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
  spent: z
    .number()
    .positive()
    .min(0, { message: "O gasto deve ser um valor positivo." }),
  statementCloseDay: z
    .number()
    .min(1)
    .max(31, { message: "O dia de fechamento deve estar entre 1 e 31." }),
  dueDay: z
    .number()
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
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      description: "",
      limit: 0,
      spent: 0,
      type: CreditCardType.VISA,
      bank: Banks.ITAU,
      status: CreditCardStatus.ACTIVE,
      statementCloseDay: 10,
      dueDay: 20,
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      console.log("data: " + data);
      await upsertCreditCard({ ...data, id: creditCardId });
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar o cartão de crédito:", error);
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Atualizar" : "Adicionar"} Cartão de Crédito
          </DialogTitle>
          <DialogDescription>Preencha as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite a descrição..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="limit"
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
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CREDIT_CARD_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banco</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o banco..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(BANK_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CREDIT_CARD_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statementCloseDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia de Fechamento</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o dia de fechamento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia de Vencimento</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Digite o dia de vencimento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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

export default UpsertCreditCardDialog;
