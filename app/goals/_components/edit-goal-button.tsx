"use client";

import { Button } from "@/app/_components/ui/button";
import UpsertGoalDialog from "@/app/_components/upsert-goal-dialog";
import { Goal } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditGoalButtonProps {
  goal: Goal;
}

const EditGoalButton = ({ goal }: EditGoalButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="link"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertGoalDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={goal}
        goalId={goal.id}
      />
    </>
  );
};

export default EditGoalButton;
