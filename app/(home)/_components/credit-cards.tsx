import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { formatCurrency } from "@/app/_utils/currency";
import { CreditCardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CreditCard {
  id: string;
  title: string;
  closingDate: string;
  limit: number;
  spent: number;
}

interface CreditCardsProps {
  creditCards: CreditCard[];
}

export const creditCards = [
  {
    id: "1",
    title: "Cartão Visa",
    closingDate: "2025-01-30",
    limit: 5000,
    spent: 3500,
  },
  {
    id: "2",
    title: "Cartão MasterCard",
    closingDate: "2025-02-05",
    limit: 4000,
    spent: 4200,
  },
  {
    id: "3",
    title: "Cartão Nubank",
    closingDate: "2025-01-25",
    limit: 10000,
    spent: 6000,
  },
  {
    id: "4",
    title: "Cartão American Express",
    closingDate: "2025-02-10",
    limit: 8000,
    spent: 500,
  },
];

const CreditCards = ({ creditCards }: CreditCardsProps) => {
  const getAmountColor = (spent: number, limit: number) => {
    if (spent > limit) {
      return "text-red-500";
    }
    return "text-foreground";
  };

  const displayedCreditCards = creditCards.slice(0, 3);

  return (
    <ScrollArea className="rounded-md border">
      <Card className="border-3">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="font-bold">Cartões de Crédito</CardTitle>
          <Button variant="outline" className="rounded-full font-bold" asChild>
            <Link href="/">Adicionar</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  <p className="text-sm font-bold">{card.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Fecha em{" "}
                    {new Date(card.closingDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
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
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default CreditCards;
