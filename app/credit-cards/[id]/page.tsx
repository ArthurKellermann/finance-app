"use client";

import { DataTable } from "./_columns/data-table";
import { transactionColumns } from "./_columns";
import getTransactionsByCreditCard from "../statements/_actions/get-transactions-by-credit-card";
import { useParams } from "next/navigation";
import type { CreditCard, Transaction } from "@prisma/client";
import { useEffect, useState } from "react";
import { getCreditCardById } from "@/app/_actions/get-credit-card-by-id";
import CreditCardDetails from "./_components/credit-card-details";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import TimeSelectCreditCard from "../_components/time-select-credit-card";
import Loading from "@/app/_components/loading";

const CreditCardDetailsPage = () => {
  const params = useParams();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [creditCard, setCreditCard] = useState<CreditCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsByCreditCard, creditCardData] = await Promise.all([
          getTransactionsByCreditCard(params.id as string),
          getCreditCardById(params.id as string),
        ]);

        if (!transactionsByCreditCard || !creditCardData) {
          throw new Error("Data not found");
        }

        setTransactions(transactionsByCreditCard);
        setCreditCard(creditCardData);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalhes do cartão</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Link href="/credit-cards">Ver fatura</Link>
            </Button>
            <TimeSelectCreditCard />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            {creditCard && transactions && (
              <CreditCardDetails
                card={creditCard}
                transactions={transactions}
              />
            )}
          </div>
          <div className="col-span-1 space-y-6 rounded-md bg-card">
            <DataTable
              columns={transactionColumns}
              data={JSON.parse(JSON.stringify(transactions))}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditCardDetailsPage;
