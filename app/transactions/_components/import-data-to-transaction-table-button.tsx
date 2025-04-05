"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import {
  Import,
  Loader2,
  FileType,
  CheckCircle,
  AlertCircle,
  Zap,
} from "lucide-react";
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
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { Progress } from "@/app/_components/ui/progress";
import axios from "axios";
import { useNotifications } from "@/app/_contexts/notifications-context";

const loadingMessages = [
  "Categorizando transações...",
  "Personalizando categorias...",
  "Identificando padrões...",
  "Quase pronto...",
];

const LoadingAnimation = () => (
  <div className="relative h-16 w-16">
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-blue-500/30"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    />
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-t-blue-600"
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute inset-2 rounded-full border-4 border-b-transparent border-l-transparent border-r-transparent border-t-purple-500"
      animate={{ rotate: -360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-blue-600"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Zap size={24} />
    </motion.div>
  </div>
);

const ImportDataToTransactionTableDialog = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState("");
  const [importStage, setImportStage] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const { userId } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (loading) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newValue = prev + Math.random() * 5;
          return newValue > 95 ? 95 : newValue;
        });
      }, 400);

      const messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);

      return () => {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
      };
    }
  }, [loading]);

  useEffect(() => {
    setCurrentMessage(loadingMessages[currentMessageIndex]);
  }, [currentMessageIndex]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFileError("");

    if (selectedFile) {
      if (!selectedFile.name.endsWith(".csv")) {
        setFileError("Por favor, selecione um arquivo CSV válido.");
        setFile(null);
        return;
      }

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

    setImportStage("processing");
    setLoading(true);
    setProgress(10);
    setCurrentMessageIndex(0);

    try {
      // Simulação do processamento do arquivo
      await new Promise((resolve) => setTimeout(resolve, 6000));

      const response = await axios.post(
        "http://localhost:3001/notifications",
        {
          recipientId: userId,
          content: `O arquivo "${file?.name}" foi importado e categorizado com sucesso. Você já pode conferir a tabela de transações.`,
          category: `📂 Importação concluída! `,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      addNotification(response.data);
      setProgress(100);
      setImportStage("success");

      setTimeout(() => {
        setIsDialogOpen(false);
        toast.success("Importação concluída com sucesso!");

        // Reset após fechar
        setTimeout(() => {
          setFile(null);
          setProgress(0);
          setImportStage("idle");
        }, 500);
      }, 2000);
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      setImportStage("error");
      toast.error("Erro ao processar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileError("");
    setImportStage("idle");
    setProgress(0);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Import className="mr-2 h-4 w-4 text-blue-600" />
                Importar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              {importStage === "processing" ? (
                <div className="flex h-56 flex-col items-center justify-center space-y-6 px-4">
                  <LoadingAnimation />

                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Progresso</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 w-full overflow-hidden bg-blue-100"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentMessage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="flex min-h-12 items-center justify-center"
                    >
                      <p className="text-center text-sm font-medium text-gray-700">
                        {currentMessage}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : importStage === "success" ? (
                <div className="flex h-52 flex-col items-center justify-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      rotate: { delay: 0.2, duration: 0.5 },
                    }}
                  >
                    <div className="rounded-full bg-green-100 p-4">
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-xl font-medium text-transparent">
                      Importação concluída!
                    </p>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center text-sm text-muted-foreground"
                  >
                    Suas transações foram categorizadas e importadas com
                    sucesso.
                  </motion.p>
                </div>
              ) : importStage === "error" ? (
                <div className="flex h-52 flex-col items-center justify-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: [0, -10, 10, -10, 0] }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                      x: { delay: 0.2, duration: 0.5 },
                    }}
                  >
                    <div className="rounded-full bg-red-100 p-4">
                      <AlertCircle className="h-16 w-16 text-red-500" />
                    </div>
                  </motion.div>
                  <p className="text-center text-lg font-medium text-red-600">
                    Erro na importação
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    Ocorreu um problema ao processar seu arquivo. Tente
                    novamente.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    className="mt-2"
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
                      Importar Extrato Bancário
                    </DialogTitle>
                    <DialogDescription>
                      <p className="text-sm text-muted-foreground">
                        Importe um extrato bancário em formato CSV e nossa IA
                        registrará e categorizará todas as suas transações
                        automaticamente.
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center justify-center">
                      {file ? (
                        <motion.div
                          className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-blue-200 bg-blue-50 p-6 py-8"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            transition={{
                              type: "spring",
                              stiffness: 260,
                              damping: 20,
                              rotate: { duration: 0.5 },
                            }}
                          >
                            <FileType className="mb-3 h-10 w-10 text-blue-500" />
                          </motion.div>
                          <p className="mb-1 text-sm font-medium text-gray-700">
                            Arquivo selecionado:
                          </p>
                          <p className="text-center text-sm font-semibold text-blue-600">
                            {file.name}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setFile(null)}
                          >
                            Alterar arquivo
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 py-10 transition-all hover:border-blue-300 hover:bg-blue-50"
                          onClick={() =>
                            document.getElementById("file")?.click()
                          }
                          whileHover={{ scale: 1.01, borderColor: "#3B82F6" }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Import className="mb-4 h-10 w-10 text-blue-400" />
                          </motion.div>
                          <motion.p
                            className="mb-2 text-sm font-medium text-gray-700"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            Clique para selecionar um arquivo
                          </motion.p>
                          <motion.p
                            className="text-center text-xs text-gray-500"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            Suporta arquivos CSV de extratos bancários
                          </motion.p>
                          {fileError && (
                            <motion.p
                              className="mt-2 text-xs font-medium text-red-500"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {fileError}
                            </motion.p>
                          )}
                          <Input
                            id="file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            disabled={loading}
                            className="hidden"
                          />
                        </motion.div>
                      )}
                    </div>
                    <motion.div
                      className="space-y-1 rounded-md bg-amber-50 p-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <h4 className="flex items-center gap-1 text-xs font-medium text-amber-800">
                        <AlertCircle className="h-3 w-3" /> Dica
                      </h4>
                      <p className="text-xs text-amber-700">
                        Certifique-se que seu arquivo CSV possui pelo menos as
                        colunas de data, descrição e valor para que a
                        categorização funcione corretamente.
                      </p>
                    </motion.div>
                  </div>
                  <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Cancelar
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        onClick={handleSubmit}
                        disabled={!file || loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          "Importar Agora"
                        )}
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="bg-gray-800 px-3 py-2 text-white"
        >
          <p className="text-xs">
            Importar transações do extrato bancário automaticamente
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImportDataToTransactionTableDialog;
