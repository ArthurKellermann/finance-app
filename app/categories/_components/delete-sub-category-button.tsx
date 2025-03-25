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

import { useToast } from "@/app/_hooks/use-toast";
import { deleteSubCategory } from "../_actions/delete-sub-category";

interface DeleteSubCategoryButtonProps {
  subcategoryId: string;
  onDeleteSuccess?: () => void;
}

const DeleteSubCategoryButton = ({
  subcategoryId,
  onDeleteSuccess,
}: DeleteSubCategoryButtonProps) => {
  const { toast } = useToast();

  const handleConfirmDeleteClick = async () => {
    try {
      await deleteSubCategory(subcategoryId);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      toast({
        title: "✅ Sub categoria deletada com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Erro ao deletar sub categoria",
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
            Você deseja realmente deletar essa sub categoria?
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

export default DeleteSubCategoryButton;
