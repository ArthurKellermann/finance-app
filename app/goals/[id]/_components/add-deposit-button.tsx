"use client";

import { DollarSign } from "lucide-react";
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
  userCanAddDeposit?: boolean;
  goalId: string;
  onDepositAdded: () => void;
}

const AddDepositButton = ({
  userCanAddDeposit,
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
              disabled={!userCanAddDeposit}
            >
              Adicionar
              <DollarSign />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddDeposit &&
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
