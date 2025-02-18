"use client";
import { CreditCard, Transaction } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Badge } from "@/app/_components/ui/badge";
import { useMemo } from "react";

interface CreditCardDetailsProps {
  card: CreditCard;
  transactions: Transaction[];
}

const CreditCardDetails = ({ card, transactions }: CreditCardDetailsProps) => {
  // Calcula o valor total da fatura no mês
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

  return (
    <Card className="h-full border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{card.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">Limite Disponível</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(availableLimit)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm">Total Gasto no Mês</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalSpentThisMonth)}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm">Número do Cartão</p>
            <p className="font-mono text-lg">**** **** **** 1234</p>
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm">Titular</p>
              <p className="text-lg">Seu Nome</p>
            </div>
            <div>
              <p className="text-sm">Validade</p>
              <p className="text-lg">12/25</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">Status</p>
            <Badge
              variant={card.status === "ACTIVE" ? "default" : "destructive"}
            >
              {card.status === "ACTIVE" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Limite Total</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(card.limit)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Gasto Total</p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(card.spent)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Dia de Fechamento</p>
            <p className="text-lg font-semibold">{card.statementCloseDay}</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Dia de Vencimento</p>
            <p className="text-lg font-semibold">{card.dueDay}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCardDetails;
