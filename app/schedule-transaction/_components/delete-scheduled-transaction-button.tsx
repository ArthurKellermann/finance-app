import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteScheduledTransaction } from "../_actions/delete-scheduled-transaction";
import { useToast } from "@/app/_hooks/use-toast";

interface DeleteScheduledTransactionProps {
  scheduledTransactionId: string;
}

const DeleteScheduledTransactionButton = ({
  scheduledTransactionId,
}: DeleteScheduledTransactionProps) => {
  const { toast } = useToast();

  const handleConfirmDeleteClick = async () => {
    try {
      await deleteScheduledTransaction(scheduledTransactionId);
      toast({
        title: "✅ Transação programada deletada com sucesso!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Ocorreu um erro ao deletar a transação.",
        description: "Tente novamente mais tarde",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-2 transition-colors hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja realmente deletar essa transação programada?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDeleteClick}>
            Continuar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteScheduledTransactionButton;
