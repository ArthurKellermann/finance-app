"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
import { getTransactionsByDate } from "@/app/_actions/get-transactions-by-date";
import { Transaction } from "@prisma/client";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { DatePicker } from "@/app/_components/ui/date-picker";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from "@/app/_constants/transactions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/app/_components/ui/progress";

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
  userCanExportData = true,
}: ExportDataFromTransactionTableDialogProps) => {
  const [fileType, setFileType] = useState<"excel" | "csv">("excel");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportStage, setExportStage] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);

  const handleExport = async () => {
    if (!startDate) {
      toast.error("Por favor, selecione uma data.");
      return;
    }

    setExportStage("processing");
    setIsLoading(true);
    setProgress(10);

    try {
      const transactions = await getTransactionsByDate(new Date(startDate));

      if (transactions.length === 0) {
        toast.error(
          "Nenhuma transação encontrada para a data selecionada. Escolha uma outra data.",
        );
        setExportStage("error");
        return;
      }

      setTransactionCount(transactions.length);
      setProgress(40);

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

      setProgress(70);

      // Pequeno atraso para mostrar o progresso
      await new Promise((resolve) => setTimeout(resolve, 800));

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

      setProgress(100);
      setExportStage("success");

      setTimeout(() => {
        setIsDialogOpen(false);
        toast.success("Exportação concluída com sucesso!");

        // Reset após fechar
        setTimeout(() => {
          setProgress(0);
          setExportStage("idle");
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      setExportStage("error");
      toast.error(
        "Ocorreu um erro ao exportar os dados. Tente novamente mais tarde.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setExportStage("idle");
    setProgress(0);
  };

  const fileTypeIcon =
    fileType === "excel" ? (
      <FileSpreadsheet className="h-5 w-5 text-green-600" />
    ) : (
      <FileText className="h-5 w-5 text-blue-600" />
    );

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full bg-white/90 transition-all hover:bg-white hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500"
                disabled={!userCanExportData}
              >
                <Download className="mr-2 h-4 w-4 text-blue-600" />
                Exportar
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="center"
            className="bg-gray-800 px-3 py-2 text-white"
          >
            <p className="text-xs">Exportar transações para Excel ou CSV</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-md">
        {exportStage === "processing" ? (
          <div className="flex h-48 flex-col items-center justify-center space-y-6 px-4">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <Progress value={progress} className="h-2 w-full" />
            <AnimatePresence mode="popLayout">
              <motion.p
                key={progress}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm font-medium text-muted-foreground"
              >
                Preparando {transactionCount} transações para exportação...
              </motion.p>
            </AnimatePresence>
          </div>
        ) : exportStage === "success" ? (
          <div className="flex h-48 flex-col items-center justify-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
            <p className="text-center text-lg font-medium">
              Exportação concluída!
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {transactionCount} transações foram exportadas com sucesso.
            </p>
          </div>
        ) : exportStage === "error" ? (
          <div className="flex h-48 flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
            <p className="text-center text-lg font-medium">
              Erro na exportação
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Ocorreu um problema ao exportar suas transações. Tente novamente.
            </p>
            <Button variant="outline" onClick={resetForm}>
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Exportar Transações
              </DialogTitle>
              <DialogDescription>
                Escolha o formato de arquivo e a data a partir da qual deseja
                exportar as transações.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-700">
                  Opções de exportação
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">
                      Formato do arquivo
                    </label>
                    <Select
                      value={fileType}
                      onValueChange={(value: "excel" | "csv") =>
                        setFileType(value)
                      }
                    >
                      <SelectTrigger className="border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="Selecione o formato" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="excel"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            Excel (.xlsx)
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="csv"
                          className="flex items-center gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-600" />
                            CSV (.csv)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500">
                      A partir desta data
                    </label>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
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
                </div>
              </div>

              <div className="space-y-1 rounded-md bg-blue-50 p-3">
                <h4 className="flex items-center gap-1 text-xs font-medium text-blue-800">
                  <AlertCircle className="h-3 w-3" /> Informação
                </h4>
                <p className="text-xs text-blue-700">
                  Serão exportadas todas as transações a partir da data
                  selecionada.
                  {fileType === "excel"
                    ? " O arquivo Excel permite melhor formatação e organização dos dados."
                    : " O formato CSV é compatível com diversos programas e planilhas."}
                </p>
              </div>
            </div>
            <DialogFooter className="flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleExport}
                disabled={isLoading}
                className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    {fileTypeIcon}
                    Exportar {fileType === "excel" ? "Excel" : "CSV"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportDataFromTransactionDialog;
