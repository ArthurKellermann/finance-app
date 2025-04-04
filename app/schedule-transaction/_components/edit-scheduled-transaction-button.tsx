"use client";

import { Button } from "@/app/_components/ui/button";
import { type ScheduledTransaction } from "@prisma/client";
import { Edit } from "lucide-react";
import { useState } from "react";
import ScheduleTransactionDialog from "./schedule-transaction-dialog";

interface EditScheduledTransactionButtonProps {
  scheduledTransaction: ScheduledTransaction;
}

const EditScheduledTransactionButton = ({
  scheduledTransaction,
}: EditScheduledTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full p-2 transition-colors hover:bg-blue-50"
        onClick={() => setDialogIsOpen(true)}
      >
        <Edit className="h-4 w-4 text-blue-500" />
      </Button>
      <ScheduleTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...scheduledTransaction,
          amount: Number(scheduledTransaction.amount),
        }}
        transactionId={scheduledTransaction.id}
      />
    </>
  );
};

export default EditScheduledTransactionButton;
