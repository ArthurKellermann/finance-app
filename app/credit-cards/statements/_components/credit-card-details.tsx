"use client";
import { CreditCard, Transaction } from "@prisma/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
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

interface CreditCardDetailsProps {
  card: CreditCard;
  transactions: Transaction[];
}

const CreditCardDetails = ({ card, transactions }: CreditCardDetailsProps) => {
  const [isFaturasDialogOpen, setIsFaturasDialogOpen] = useState(false);

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

  const faturasFechadas = useMemo(() => {
    const groupedTransactions = groupBy(transactions, (t) => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    });

    return Object.entries(groupedTransactions).map(([key, transacoes]) => {
      const total = transacoes.reduce((sum, t) => sum + Number(t.amount), 0);
      return {
        periodo: key,
        total,
      };
    });
  }, [transactions]);

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
            <Image
              src={card.imagePath}
              alt={card.type}
              width={40}
              height={25}
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <p className="text-sm">Titular</p>
              <p className="text-lg">Seu nome</p>
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
              {CREDIT_CARD_STATUS_LABELS[card.status]}
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

        <Button className="w-full" onClick={() => setIsFaturasDialogOpen(true)}>
          Ver Faturas Fechadas
        </Button>

        <Dialog
          open={isFaturasDialogOpen}
          onOpenChange={setIsFaturasDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Faturas Fechadas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {faturasFechadas.map((fatura, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-semibold">Período: {fatura.periodo}</p>
                  <p>
                    Total:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(fatura.total)}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CreditCardDetails;
