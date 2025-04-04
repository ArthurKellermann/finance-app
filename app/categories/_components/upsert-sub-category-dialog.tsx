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
import { CheckCircle, Tag } from "lucide-react";

interface UpsertSubCategoryDialogProps {
  isOpen: boolean;
  defaultValues?: FormSchema;
  subCategoryId?: string;
  categoryId?: string;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess?: () => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "O nome é obrigatório." }),
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
        title: `✅ Sub categoria ${subCategoryId ? "atualizada" : "adicionada"} com sucesso`,
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
      <DialogContent
        className="overflow-hidden border-none p-0 shadow-lg sm:max-w-md"
        style={{ borderRadius: "20px" }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="mb-1 text-xl font-bold">
              <div className="flex items-center gap-2">
                {isUpdate ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Tag className="h-6 w-6" />
                )}
                {isUpdate ? "Atualizar" : "Nova"} Sub Categoria
              </div>
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Preencha os detalhes abaixo para{" "}
              {isUpdate ? "atualizar" : "registrar"} sua sub categoria
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium text-gray-700">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <Input
                          placeholder="Digite o nome..."
                          className="rounded-lg border-gray-200 pl-10 focus:border-blue-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
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
                  className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  {isUpdate ? "Atualizar" : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpsertSubCategoryDialog;
