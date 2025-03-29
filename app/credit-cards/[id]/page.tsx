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
import {
  CreditCard as CreditCardIcon,
  Receipt,
  Calendar,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

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
    <div className="">
      <div className="">
        {/* Header com gradiente */}
        <div className="rounded-b-2xl p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full bg-white/20 p-0 text-white hover:bg-white/30"
                asChild
              >
                <Link href="/credit-cards">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <CreditCardIcon className="h-6 w-6" />
                Detalhes do Cartão
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar Dados
              </Button>
              <TimeSelectCreditCard />
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="mt-6 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Painel de detalhes do cartão */}
            <div className="col-span-1">
              {creditCard && transactions && (
                <div className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                  <div className="border-b border-gray-100 p-4">
                    <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                      <CreditCardIcon className="h-5 w-5 text-blue-500" />
                      Resumo do Cartão
                    </h2>
                  </div>
                  <div className="p-4">
                    <CreditCardDetails
                      card={creditCard}
                      transactions={transactions}
                    />
                  </div>
                </div>
              )}

              {/* Botão de Fatura */}
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-blue-500 py-6 text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <Link
                    href="/credit-cards"
                    className="flex items-center justify-center gap-2"
                  >
                    <Receipt className="h-5 w-5" />
                    <span className="font-semibold">
                      Visualizar Fatura Completa
                    </span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Tabela de transações */}
            <div className="col-span-1">
              <div className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <div className="border-b border-gray-100 p-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <Calendar className="h-5 w-5 text-purple-500" />
                    Transações Recentes
                  </h2>
                </div>
                <div className="p-4">
                  <DataTable
                    columns={transactionColumns}
                    data={JSON.parse(JSON.stringify(transactions))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardDetailsPage;
