import { Badge } from "@/app/_components/ui/badge";
import { Transaction, TransactionType } from "@prisma/client";
import { CircleIcon } from "lucide-react";

interface TransactionTypeBadgeProps {
  transaction: Transaction;
}

const TransactionTypeBadge = ({ transaction }: TransactionTypeBadgeProps) => {
  if (transaction.type === TransactionType.DEPOSIT) {
    return (
      <Badge className="bg-muted bg-opacity-10 font-bold text-blue-500 hover:bg-background">
        <CircleIcon className="mr-2 fill-blue-500" size={10} />
        Depósito
      </Badge>
    );
  }
  if (transaction.type === TransactionType.EXPENSE) {
    return (
      <Badge className="bg-muted bg-opacity-10 font-bold text-red-500 hover:bg-background">
        <CircleIcon className="mr-2 fill-red-500" size={10} />
        Despesa
      </Badge>
    );
  }
  return (
    <Badge className="bg-muted bg-opacity-10 font-bold text-secondary-foreground hover:bg-background">
      <CircleIcon className="mr-2 fill-secondary-foreground" size={10} />
      Investimento
    </Badge>
  );
};

export default TransactionTypeBadge;
