import AddCreditCardButton from "@/app/_components/add-credit-card-button";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { formatCurrency } from "@/app/_utils/currency";
import { CreditCard } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  CreditCard as CreditCardIcon,
  FileText,
  MoreHorizontal,
} from "lucide-react";

interface CreditCardsProps {
  creditCards: CreditCard[];
  totalSpentByCreditCardPerMonth: Record<string, number>;
  month: string;
}

const CreditCards = ({
  creditCards,
  totalSpentByCreditCardPerMonth,
  month,
}: CreditCardsProps) => {
  const getAmountColor = (spent: number, limit: number) => {
    const percentSpent = (spent / limit) * 100;
    if (percentSpent > 100) {
      return "text-red-600";
    }
    if (percentSpent > 80) {
      return "text-yellow-600";
    }
    return "text-green-600";
  };

  const getMonthName = (monthNumber: number) => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return monthNames[monthNumber];
  };

  const displayedCreditCards = creditCards.slice(0, 3);

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <CreditCardIcon className="h-6 w-6" />
          <CardTitle className="text-xl font-bold">
            Cartões de Crédito
          </CardTitle>
        </div>
        <AddCreditCardButton userCanAddCreditCard={true} />
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {displayedCreditCards.length > 0 ? (
          displayedCreditCards.map((card) => {
            const spentThisMonth =
              totalSpentByCreditCardPerMonth[card.id as string] || 0;
            const percentSpent = (spentThisMonth / card.limit) * 100;

            return (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Image
                      src={card.imagePath}
                      height={32}
                      width={48}
                      alt="Cartão de Crédito"
                      className="rounded-md object-contain opacity-80"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {card.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Fecha em {card.statementCloseDay} de{" "}
                      {getMonthName(Number(month))} de{" "}
                      {new Date().getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${getAmountColor(spentThisMonth, card.limit)}`}
                    >
                      {formatCurrency(spentThisMonth)}
                    </p>
                    <p className="text-xs text-gray-500">
                      de {formatCurrency(card.limit)}
                      <span className="ml-2 text-xs text-gray-400">
                        ({percentSpent.toFixed(1)}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="mb-2 text-sm text-gray-500">
              Nenhum cartão de crédito encontrado
            </p>
            <p className="text-xs text-gray-400">
              Adicione um cartão para começar a acompanhar seus gastos
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t bg-gray-50 p-4">
        <div className="flex w-full space-x-4">
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link href="/credit-cards/statements">
              <FileText className="h-4 w-4" />
              Conferir faturas
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-green-500 text-green-600 hover:bg-green-50"
            asChild
          >
            <Link href="/credit-cards">
              <MoreHorizontal className="h-4 w-4" />
              Ver mais
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CreditCards;
