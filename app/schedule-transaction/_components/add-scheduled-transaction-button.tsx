"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import ScheduleTransactionDialog from "./schedule-transaction-dialog";

interface AddScheduledTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddScheduledTransactionButton = ({
  userCanAddTransaction,
}: AddScheduledTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddTransaction}
            >
              Programar transação
              <ArrowDownUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddTransaction &&
              "Você atingiu o limite de transações. Atualize seu plano para criar transações ilimitadas."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ScheduleTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddScheduledTransactionButton;
