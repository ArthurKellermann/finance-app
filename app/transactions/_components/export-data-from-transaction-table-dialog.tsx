import { Download } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useState } from "react";
import { getTransactionsByDate } from "@/app/_actions/get-transactions-by-date";
import { Transaction } from "@prisma/client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DatePicker } from "@/app/_components/ui/date-picker";
import { toast } from "sonner";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";

interface ExportDataFromTransactionTableDialogProps {
  userCanExportData?: boolean;
}

type TransactionWithCategory = Transaction & {
  category: {
    name: string;
    color: string;
    icon: string;
  };
};

const ExportDataFromTransactionDialog = ({
  userCanExportData,
}: ExportDataFromTransactionTableDialogProps) => {
  const [fileType, setFileType] = useState<"excel" | "csv">("excel");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExport = async () => {
    if (!startDate) {
      toast.error("Por favor, selecione uma data.");
      return;
    }

    setIsLoading(true);

    try {
      const transactions = await getTransactionsByDate(new Date(startDate));

      if (transactions.length === 0) {
        toast.error("Nenhuma transação encontrada para a data selecionada.");
        return;
      }

      const data = transactions.map((transaction: TransactionWithCategory) => ({
        Nome: transaction.name,
        Tipo:
          TRANSACTION_TYPE_OPTIONS.find((opt) => opt.value === transaction.type)
            ?.label || transaction.type,
        Categoria:
          TRANSACTION_CATEGORY_LABELS[
            transaction.category
              .name as keyof typeof TRANSACTION_CATEGORY_LABELS
          ] || transaction.category.name,
        Valor: Number(transaction.amount).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        Método:
          TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod] ||
          transaction.paymentMethod,
        Data: new Date(transaction.date).toLocaleDateString("pt-BR"),
      }));

      if (fileType === "excel") {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transações");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(
          blob,
          `transacoes_${startDate.toISOString().split("T")[0]}.xlsx`,
        );
      } else if (fileType === "csv") {
        const csvContent = data
          .map((row) => Object.values(row).join(","))
          .join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, `transacoes_${startDate.toISOString().split("T")[0]}.csv`);
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast.error("Ocorreu um erro ao exportar os dados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-md"
          disabled={!userCanExportData}
        >
          <Download />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-4">
          <DialogTitle>Exportar Transações</DialogTitle>
          <DialogDescription>
            Escolha o tipo de arquivo e a data a partir da qual deseja exportar
            as transações.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-10">
          <div className="">
            <Select
              value={fileType}
              onValueChange={(value: "excel" | "csv") => setFileType(value)}
            >
              <SelectTrigger className="mr-2 w-full">
                <SelectValue placeholder="Selecione o tipo de arquivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <DatePicker
              onChange={(e) => {
                if (!e) {
                  setStartDate(new Date());
                  return;
                }
                setStartDate(new Date(e));
              }}
              value={startDate}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Exportando..." : "Exportar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataFromTransactionDialog;
