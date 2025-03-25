import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { upsertSubCategory } from "../_actions/upsert-sub-category";
import { useToast } from "@/app/_hooks/use-toast";

interface UpsertSubCategoryDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  subCategoryId?: string;
  categoryId?: string;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatória." }),
});

type FormSchema = z.infer<typeof formSchema>;

const UpsertSubCategoryDialog = ({
  isOpen,
  defaultValues,
  subCategoryId,
  categoryId,
  setIsOpen,
  onSuccess,
}: UpsertSubCategoryDialogProps) => {
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      name: "",
    },
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      await upsertSubCategory({
        ...data,
        id: subCategoryId,
        categoryId: categoryId,
      });

      setIsOpen(false);

      toast({
        title: `Sub categoria ${data.name} ${subCategoryId ? "atualizada" : "criada"} com sucesso!`,
        variant: "default",
      });

      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro ao salvar sub categoria",
        variant: "destructive",
      });
      console.error("Erro ao salvar a sub categoria.", error);
    }
  };

  const isUpdate = Boolean(subCategoryId);

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
            {isUpdate ? "Atualizar" : "Adicionar"} Sub Categoria
          </DialogTitle>
          <DialogDescription>Preencha as informações abaixo</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="col-span-2 mt-4">
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

export default UpsertSubCategoryDialog;
