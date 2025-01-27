"use client";

import { Button } from "@/app/_components/ui/button";
import UpsertCreditCardDialog from "@/app/_components/upsert-credit-card-dialog";
import { CreditCard } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

interface EditCreditCardButtonProps {
  creditCard: CreditCard;
}

const EditCreditCardButton = ({ creditCard }: EditCreditCardButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => setDialogIsOpen(true)}
      >
        <PencilIcon />
      </Button>
      <UpsertCreditCardDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
        defaultValues={{
          ...creditCard,
          type: creditCard.type,
          status: creditCard.status,
          bank: creditCard.bank,
        }}
        creditCardId={creditCard.id}
      />
    </>
  );
};

export default EditCreditCardButton;
