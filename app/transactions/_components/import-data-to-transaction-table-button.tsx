"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Import } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { useState } from "react";
import { categorizeDataFromImportedFile } from "../_actions/categorize-data-from-imported-file";

const ImportDataToTransactionTableDialog = () => {
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      const fileText = await file.text();
      const result = await categorizeDataFromImportedFile(fileText);
      console.log(result);
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full" variant="outline">
                Importar
                <Import />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Importar Extrato Bancário</DialogTitle>
              </DialogHeader>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={loading}
              />
              {loading && <p>Processando arquivo...</p>}
            </DialogContent>
          </Dialog>
        </TooltipTrigger>
        <TooltipContent>
          <p>Importar dados de um extrato para a tabela de transações</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImportDataToTransactionTableDialog;
