import CreditCard from "./_components/credit-card";
import getCreditCards from "../_actions/get-credit-cards";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AddCreditCardButton from "../_components/add-credit-card-button";
import { Button } from "../_components/ui/button";
import Link from "next/link";

const CreditCardsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/get-started");
  }

  const creditCards = await getCreditCards({ userId });

  return (
    <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="mb-10 text-2xl font-bold">Cartões de Crédito</h1>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Link href="/credit-cards/statements">Ver faturas</Link>
          </Button>
          <AddCreditCardButton userCanAddCreditCard={true} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {creditCards.length > 0 ? (
          creditCards.map((card: any) => <CreditCard key={card.id} {...card} />)
        ) : (
          <p className="text-gray-500">Nenhum cartão cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default CreditCardsPage;
