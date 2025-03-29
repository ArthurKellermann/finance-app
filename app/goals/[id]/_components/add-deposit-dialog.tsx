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
import { Calendar, DollarSign, PiggyBank } from "lucide-react";

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
      <DialogContent className="overflow-hidden rounded-xl border-none p-0 shadow-lg sm:max-w-md">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-6 w-6" />
                Adicionar Depósito
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Insira o valor e a data do seu depósito para a meta
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          onValueChange={({ floatValue }) => {
                            field.onChange(floatValue || 0);
                          }}
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
                        onChange={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                        }}
                      />
                    </div>
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
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepositDialog;
