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
import { TrashIcon } from "lucide-react";
import { deleteDeposit } from "@/app/_actions/delete-goal";
import { useToast } from "@/app/_hooks/use-toast";

interface DeleteDepositButtonProps {
  depositId: string;
  onDepositDeleted: () => void;
}

const DeleteDepositButton = ({
  depositId,
  onDepositDeleted,
}: DeleteDepositButtonProps) => {
  const { toast } = useToast();

  const handleConfirmDeleteClick = async () => {
    try {
      await deleteDeposit({ depositId });
      onDepositDeleted();
      toast({
        title: "✅ Depósito deletado com sucesso!",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Erro ao deletar depósito",
        description: "Tente novamente mais tarde",
      });
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja realmente deletar esse depósito?
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

export default DeleteDepositButton;
