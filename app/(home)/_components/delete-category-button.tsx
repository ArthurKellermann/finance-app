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
import { deleteCategory } from "../../_actions/delete-category";
import { useToast } from "@/app/_hooks/use-toast";

interface DeleteCategoryButtonProps {
  categoryId: string;
  onDeleteSuccess: () => void;
}

const DeleteCategoryButton = ({
  categoryId,
  onDeleteSuccess,
}: DeleteCategoryButtonProps) => {
  const { toast } = useToast();

  const handleConfirmDeleteClick = async () => {
    try {
      await deleteCategory({ categoryId });
      onDeleteSuccess();
      toast({
        title: "✅ Categoria deletada com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Erro ao deletar categoria",
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
            Você deseja realmente deletar essa categoria?
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

export default DeleteCategoryButton;
