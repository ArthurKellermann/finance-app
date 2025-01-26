import AddCreditCardButton from "@/app/_components/add-credit-card-button";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { formatCurrency } from "@/app/_utils/currency";
import { CreditCard } from "@prisma/client";
import { CreditCardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CreditCardsProps {
  creditCards: CreditCard[];
}

const CreditCards = ({ creditCards }: CreditCardsProps) => {
  const getAmountColor = (spent: number, limit: number) => {
    if (spent > limit) {
      return "text-red-500";
    }
    return "text-foreground";
  };

  const displayedCreditCards = creditCards.slice(0, 3);

  return (
    <Card className="border-3 h-full rounded-md">
      <CardHeader className="flex-row items-center justify-between rounded-t-md">
        <CardTitle className="font-bold">Cartões de Crédito</CardTitle>
        <AddCreditCardButton userCanAddCreditCard={true} />
      </CardHeader>
      <CardContent className="space-y-4 rounded-b-md">
        {displayedCreditCards.map((card) => (
          <div key={card.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white bg-opacity-[3%] p-3 text-white">
                <CreditCardIcon size={16} />
                <Image
                  src="/visa.png"
                  height={20}
                  width={20}
                  alt="Cartão de Crédito"
                />
              </div>
              <div>
                <p className="text-sm font-bold">{card.description}</p>
                <p className="text-sm text-muted-foreground">
                  Fecha em{" "}
                  {new Date(card.statementCloseDay).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p
                className={`text-sm font-bold ${getAmountColor(card.spent, card.limit)}`}
              >
                {formatCurrency(card.spent)}
              </p>
              <p className="text-sm text-muted-foreground">
                / {formatCurrency(card.limit)}
              </p>
            </div>
          </div>
        ))}
        <div className="flex w-full space-x-4">
          <Button variant="outline" className="flex-1 rounded-full">
            <Link href="/">Conferir faturas</Link>
          </Button>
          <Button variant="outline" className="flex-1 rounded-full">
            <Link href="/">Ver mais</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCards;
