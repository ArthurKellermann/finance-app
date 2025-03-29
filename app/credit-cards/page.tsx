import { auth } from "@clerk/nextjs/server";
import getCreditCards from "../_actions/get-credit-cards";
import AddCreditCardButton from "../_components/add-credit-card-button";
import { redirect } from "next/navigation";
import CreditCard from "./_components/credit-card";
import { CreditCard as CreditCardIcon, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "../_components/ui/button";
import Link from "next/link";

const CreditCardsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/get-started");
  }

  const creditCards = await getCreditCards({ userId });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
        <CardHeader className="bp-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <CreditCardIcon className="h-8 w-8" />
              Cartões de Crédito
            </CardTitle>
            <p className="mt-1 text-sm">Gerencie seus cartões e faturas</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="">
              <Link
                href="/credit-cards/statements"
                className="flex items-center gap-2"
              >
                <Receipt className="h-4 w-4" />
                Ver faturas
              </Link>
            </Button>
            <AddCreditCardButton userCanAddCreditCard={true} />
          </div>
        </CardHeader>

        <div className="p-6">
          {creditCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {creditCards.map((card: any) => (
                <div
                  key={card.id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <CreditCard {...card} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
              <CreditCardIcon className="mb-4 h-16 w-16 text-gray-300" />
              <p className="mb-2 text-lg text-gray-600">
                Nenhum cartão cadastrado ainda
              </p>
              <p className="max-w-md text-sm text-gray-400">
                Adicione seus cartões de crédito para monitorar gastos e
                gerenciar faturas
              </p>
              <div className="mt-6">
                <AddCreditCardButton userCanAddCreditCard={true} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreditCardsPage;
