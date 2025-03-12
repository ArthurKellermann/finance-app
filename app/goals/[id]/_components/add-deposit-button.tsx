"use client";

import { CreditCardIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import AddDepositDialog from "./add-deposit-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { toast } from "sonner";

interface AddDepositButtonProps {
  userCanAddCreditCard?: boolean;
  goalId: string;
}

const AddDepositButton = ({
  userCanAddCreditCard,
  goalId,
}: AddDepositButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleSubmitDeposit = async () => {
    toast.success("Deposito adicionado com sucesso!");
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="rounded-full font-bold"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddCreditCard}
            >
              Adicionar
              <CreditCardIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddCreditCard &&
              "Você atingiu o limite de cartões de crédito. Atualize seu plano para adicionar mais."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AddDepositDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        goalId={goalId}
        onSubmitDeposit={handleSubmitDeposit}
      />
    </>
  );
};

export default AddDepositButton;
