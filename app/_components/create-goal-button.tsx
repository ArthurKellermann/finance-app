"use client";

import { GoalIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import UpsertGoalDialog from "./upsert-goal-dialog";

interface CreateGoalButtonProps {
  userCanAddCreditCard?: boolean;
}

const CreateGoalButton = ({ userCanAddCreditCard }: CreateGoalButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              className="rounded-full"
              onClick={() => setDialogIsOpen(true)}
              disabled={!userCanAddCreditCard}
            >
              Adicionar
              <GoalIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!userCanAddCreditCard &&
              "Você atingiu o limite de metas. Atualize seu plano para adicionar mais."}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <UpsertGoalDialog isOpen={dialogIsOpen} setIsOpen={setDialogIsOpen} />
    </>
  );
};

export default CreateGoalButton;
