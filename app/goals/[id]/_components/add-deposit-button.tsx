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

interface AddDepositButtonProps {
  userCanAddCreditCard?: boolean;
  goalId: string;
  onDepositAdded: () => void;
}

const AddDepositButton = ({
  userCanAddCreditCard,
  goalId,
  onDepositAdded,
}: AddDepositButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

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
        onDepositAdded={onDepositAdded}
      />
    </>
  );
};

export default AddDepositButton;
