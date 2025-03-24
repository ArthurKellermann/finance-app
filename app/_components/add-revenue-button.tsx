"use client";

import { ArrowUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import AddRevenueDialog from "./add-revenue-dialog";

interface AddRevenueButtonProps {
  userCanAddTransaction?: boolean;
}

const AddRevenueButton = ({ userCanAddTransaction }: AddRevenueButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full bg-blue-500 font-bold text-white"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
              variant="ghost"
            >
              Receita
              <ArrowUpIcon className="mr-2" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddRevenueDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
};

export default AddRevenueButton;
