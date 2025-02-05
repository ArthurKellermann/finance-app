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
import Image from "next/image";
import Link from "next/link";

interface CreditCardsProps {
  creditCards: CreditCard[];
  totalSpentByCreditCardPerMonth: Record<string, number>;
}

const CreditCards = ({
  creditCards,
  totalSpentByCreditCardPerMonth,
}: CreditCardsProps) => {
  const getAmountColor = (spent: number, limit: number) => {
    if (spent > limit) {
      return "text-red-500";
    }
    return "text-foreground";
  };

  const displayedCreditCards = creditCards.slice(0, 3);

  return (
    <Card className="border-3">
      <CardHeader className="flex-row items-center justify-between rounded-t-md">
        <CardTitle className="font-bold">Cartões de Crédito</CardTitle>
        <AddCreditCardButton userCanAddCreditCard={true} />
      </CardHeader>
      <CardContent className="space-y-4 rounded-b-md">
        {displayedCreditCards.map((card) => (
          <div key={card.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2">
                <Image
                  src={card.imagePath}
                  height={24}
                  width={40}
                  alt="Cartão de Crédito"
                  className="object-contain opacity-80"
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
                {formatCurrency(
                  totalSpentByCreditCardPerMonth[card.id as string] || 0,
                )}
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
