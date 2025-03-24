import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { MoneyInput } from "@/app/_components/money-input";
import { DatePicker } from "@/app/_components/ui/date-picker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import createGoalDeposit from "../../_actions/create-goal-deposit";
import { useToast } from "@/app/_hooks/use-toast";

interface AddDepositDialogProps {
  isOpen: boolean;
  goalId: string;
  setIsOpen: (isOpen: boolean) => void;
  onDepositAdded: () => void;
}

const depositSchema = z.object({
  amount: z
    .number({
      required_error: "O valor é obrigatório.",
    })
    .positive({
      message: "O valor deve ser positivo.",
    }),
  date: z.date({
    required_error: "A data é obrigatória.",
  }),
});

type DepositSchema = z.infer<typeof depositSchema>;

const AddDepositDialog = ({
  isOpen,
  goalId,
  setIsOpen,
  onDepositAdded,
}: AddDepositDialogProps) => {
  const { toast } = useToast();
  const form = useForm<DepositSchema>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: DepositSchema) => {
    try {
      await createGoalDeposit({ ...data, goalId });
      setIsOpen(false);
      toast({
        title: "✅ Depósito adicionado com sucesso",
      });
      form.reset();
      onDepositAdded();
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      toast({
        title: "❌ Erro ao adicionar depósito",
        description: "Tente novamente mais tarde",
      });
    }
  };

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Depósito</DialogTitle>
          <DialogDescription>
            Insira o valor e a data do depósito.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                      onValueChange={({ floatValue }) => {
                        field.onChange(floatValue || 0);
                      }}
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
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <DatePicker
                    value={field.value}
                    onChange={(date) => {
                      if (date) {
                        field.onChange(date);
                      }
                    }}
                  />
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
              <Button type="submit">Adicionar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepositDialog;
