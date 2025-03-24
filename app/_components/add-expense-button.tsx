"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import AddExpenseDialog from "./add-expense-dialog";

interface AddExpenseButtonProps {
  userCanAddTransaction?: boolean;
}

const AddExpenseButton = ({ userCanAddTransaction }: AddExpenseButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              style={{ border: "1px solid" }}
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
              variant="outline"
            >
              Despesa
              <ArrowDown className="mr-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddExpenseDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
};

export default AddExpenseButton;
