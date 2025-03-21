"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Import, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { categorizeDataFromImportedFile } from "../_actions/categorize-data-from-imported-file";

const loadingMessages = [
  "Categorizando transações...",
  "Personalizando categorias...",
  "Identificando padrões...",
  "Quase pronto...",
];

const ImportDataToTransactionTableDialog = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (loading) {
      let i = 0;
      const interval = setInterval(() => {
        setCurrentMessage(loadingMessages[i]);
        i = (i + 1) % loadingMessages.length;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(
        `O arquivo "${selectedFile.name}" foi adicionado. Clique em "Enviar" para processá-lo.`,
      );
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Nenhum arquivo selecionado.");
      return;
    }

    setLoading(true);
    try {
      const fileText = await file.text();
      const result = await categorizeDataFromImportedFile(fileText);

      if (result.success) {
        toast.success("Arquivo processado com sucesso!");
        setIsDialogOpen(false);
      } else {
        toast.error(result.message || "Erro ao processar o arquivo.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao processar o arquivo.");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-full transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Import className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              {loading ? (
                <div className="flex h-48 flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <AnimatePresence mode="popLayout">
                    <motion.p
                      key={currentMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-sm text-muted-foreground"
                    >
                      {currentMessage}
                    </motion.p>
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                      Importar Extrato Bancário (CSV)
                    </DialogTitle>
                    <DialogDescription>
                      <p className="text-sm text-muted-foreground">
                        Importe um extrato bancário e deixe que nossa IA
                        registre e categorize todas as suas transações.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file" className="text-sm font-medium">
                        Selecione o arquivo CSV
                      </Label>
                      <Button
                        onClick={() => document.getElementById("file")?.click()}
                        disabled={loading}
                        className="mt-4 flex items-center justify-center gap-2"
                      >
                        <Import className="h-4 w-4" />
                        {loading ? "Carregando..." : "Importar Arquivo"}
                      </Button>
                      <Input
                        id="file"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="hidden"
                      />
                    </div>
                    {file && (
                      <p className="text-sm text-muted-foreground">
                        Arquivo selecionado:{" "}
                        <span className="font-semibold">{file.name}</span>
                      </p>
                    )}
                  </div>
                  <DialogFooter className="mt-4">
                    <Button onClick={handleSubmit} disabled={!file || loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Enviar"
                      )}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p className="text-sm text-muted-foreground">
            Importar dados de um extrato para a tabela de transações
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImportDataToTransactionTableDialog;
