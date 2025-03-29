"use client";
import { CreditCard, Transaction } from "@prisma/client";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { useMemo, useState } from "react";
import Image from "next/image";
import { CREDIT_CARD_STATUS_LABELS } from "@/app/_constants/credit-cards";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { groupBy } from "lodash";
import { useUser } from "@clerk/nextjs";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

interface CreditCardDetailsProps {
  card: CreditCard;
  transactions: Transaction[];
}

const CreditCardDetails = ({ card, transactions }: CreditCardDetailsProps) => {
  const [isFaturasDialogOpen, setIsFaturasDialogOpen] = useState(false);
  const { user } = useUser();

  const totalSpentThisMonth = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.creditCardId === card.id
        );
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions, card.id]);

  const availableLimit = card.limit - card.spent;
  const limitPercentage = Math.round((card.spent / card.limit) * 100);

  const faturasFechadas = useMemo(() => {
    const groupedTransactions = groupBy(transactions, (t) => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    });

    return Object.entries(groupedTransactions)
      .map(([key, transacoes]) => {
        const [year, month] = key.split("-");
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
        const monthName = monthNames[parseInt(month) - 1];
        const displayPeriod = `${monthName}/${year}`;

        const total = transacoes.reduce((sum, t) => sum + Number(t.amount), 0);
        return {
          periodo: key,
          displayPeriod,
          total,
          transacoes,
        };
      })
      .sort((a, b) => b.periodo.localeCompare(a.periodo)); // Sort by most recent
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
      <CardContent className="space-y-8">
        {/* Card Visual Representation */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-purple-800 p-6 text-white shadow-lg">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-white/5"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-white/5"></div>

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70">Cartão</p>
              <p className="text-lg font-bold">{card.description}</p>
            </div>
            <div>
              <Image
                src={card.imagePath}
                alt={card.type}
                width={50}
                height={32}
                className="shadow-sm"
              />
            </div>
          </div>

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs text-white/70">Titular</p>
              <p className="text-md font-medium">{user?.fullName}</p>
            </div>
            <div>
              <Badge
                className={`${
                  card.status === "ACTIVE"
                    ? "bg-green-500/80 hover:bg-green-500/90"
                    : "bg-red-500/80 hover:bg-red-500/90"
                } border-none text-white`}
              >
                {CREDIT_CARD_STATUS_LABELS[card.status]}
              </Badge>
            </div>
          </div>

          {/* Progress bar for limit */}
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-white/80">Limite Utilizado</span>
              <span className="text-xs font-medium text-white/80">
                {limitPercentage}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-white/20">
              <div
                className={`h-2.5 rounded-full ${
                  limitPercentage > 80
                    ? "bg-red-400"
                    : limitPercentage > 60
                      ? "bg-yellow-300"
                      : "bg-green-400"
                }`}
                style={{ width: `${limitPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Key Financial Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-700">Limite Disponível</p>
            </div>
            <p className="text-xl font-bold text-blue-700">
              {formatCurrency(availableLimit)}
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4">
            <div className="mb-1 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-600" />
              <p className="text-sm text-gray-700">Gasto Mensal</p>
            </div>
            <p className="text-xl font-bold text-purple-700">
              {formatCurrency(totalSpentThisMonth)}
            </p>
          </div>
        </div>

        {/* Card Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <DollarSign className="mt-1 h-5 w-5 text-gray-500" />
              <div>
                <p className="mb-1 text-sm text-gray-500">Limite Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(card.limit)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <Calendar className="mt-1 h-5 w-5 text-gray-500" />
              <div>
                <p className="mb-1 text-sm text-gray-500">Dia de Fechamento</p>
                <p className="text-lg font-semibold text-gray-800">
                  {card.statementCloseDay}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <AlertCircle className="mt-1 h-5 w-5 text-gray-500" />
              <div>
                <p className="mb-1 text-sm text-gray-500">Gasto Total</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatCurrency(card.spent)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <Clock className="mt-1 h-5 w-5 text-gray-500" />
              <div>
                <p className="mb-1 text-sm text-gray-500">Dia de Vencimento</p>
                <p className="text-lg font-semibold text-gray-800">
                  {card.dueDay}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices Button */}
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700"
          onClick={() => setIsFaturasDialogOpen(true)}
        >
          <FileText className="mr-2 h-4 w-4" />
          Ver Faturas Fechadas
        </Button>

        {/* Invoices Dialog */}
        <Dialog
          open={isFaturasDialogOpen}
          onOpenChange={setIsFaturasDialogOpen}
        >
          <DialogContent className="max-w-md rounded-lg bg-white p-0">
            <DialogHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <FileText className="h-5 w-5" />
                Faturas Fechadas
              </DialogTitle>
            </DialogHeader>

            <div className="max-h-96 overflow-y-auto p-6">
              {faturasFechadas.length > 0 ? (
                <div className="space-y-4">
                  {faturasFechadas.map((fatura, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold text-gray-800">
                          {fatura.displayPeriod}
                        </p>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800">
                          {fatura.transacoes.length} itens
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-lg font-bold text-blue-700">
                          {formatCurrency(fatura.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <CheckCircle className="mx-auto mb-4 h-10 w-10 text-gray-300" />
                  <p className="text-gray-500">
                    Nenhuma fatura fechada encontrada
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CreditCardDetails;
