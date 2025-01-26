"use client";

import { CreditCardIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertCreditCardDialog from "./upsert-credit-card-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface AddCreditCardButtonProps {
  userCanAddCreditCard?: boolean;
}

const AddCreditCardButton = ({
  userCanAddCreditCard,
}: AddCreditCardButtonProps) => {
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
      <UpsertCreditCardDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddCreditCardButton;
