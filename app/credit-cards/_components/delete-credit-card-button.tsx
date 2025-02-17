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
import { deleteCreditCard } from "../_actions/delete-credit-card";
import { toast } from "sonner";

interface DeleteCreditCardButtonProps {
  creditCardId: string;
  onDeleteSuccess: () => void;
}

const DeleteCreditCardButton = ({
  creditCardId,
  onDeleteSuccess,
}: DeleteCreditCardButtonProps) => {
  const handleConfirmDeleteClick = async () => {
    try {
      await deleteCreditCard({ creditCardId });
      onDeleteSuccess();
      toast.success("Cartão deletado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao deletar a categoria.");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="link" size="icon" className="text-muted-foreground">
          <TrashIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Você deseja realmente deletar esse cartão?
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

export default DeleteCreditCardButton;
