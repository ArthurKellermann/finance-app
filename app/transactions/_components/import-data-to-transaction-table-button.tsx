import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { Import } from "lucide-react";

const ImportDataToTransactionTableDialog = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="rounded-full" variant="outline">
            Importar
            <Import />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Importar dados de um extrato para a tabela de transações</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ImportDataToTransactionTableDialog;
