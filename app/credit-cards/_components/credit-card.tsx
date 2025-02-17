"use client";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { cn } from "@/app/_lib/utils";
import Image from "next/image";
import { CheckCircle, XCircle, AlertTriangle, Ban, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { CREDIT_CARD_STATUS_LABELS } from "@/app/_constants/credit-cards";
import DeleteCreditCardButton from "./delete-credit-card-button";
import { useState } from "react";

interface CreditCardProps {
  id: string;
  description: string;
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED" | "EXPIRED" | "CANCELLED";
  limit: string;
  spent: string;
  imagePath: string;
  type: string;
  bank: string;
  statementCloseDay: string;
  dueDay: string;
}

const statusIcons: Record<
  CreditCardProps["status"],
  { icon: any; color: string }
> = {
  ACTIVE: { icon: CheckCircle, color: "text-green-500" },
  SUSPENDED: { icon: AlertTriangle, color: "text-yellow-500" },
  BLOCKED: { icon: XCircle, color: "text-red-500" },
  EXPIRED: { icon: Clock, color: "text-gray-500" },
  CANCELLED: { icon: Ban, color: "text-red-700" },
};

export default function CreditCard({
  id,
  description,
  dueDay,
  imagePath,
  limit,
  statementCloseDay,
  status,
  type,
  spent,
}: CreditCardProps) {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteSuccess = () => {
    setIsDeleted(true);
  };

  if (isDeleted) return null;

  const totalSpent = (parseFloat(spent) / parseFloat(limit)) * 100;
  const { icon: StatusIcon, color: statusColor } = statusIcons[status];

  return (
    <div>
      <Card
        className={cn(
          "relative h-48 w-80 transform overflow-hidden rounded-xl p-2 text-white shadow-lg transition-transform duration-300 hover:scale-105",
          "bg-gradient-to-r from-blue-500 to-blue-800",
        )}
      >
        <CardContent className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{description}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <StatusIcon className={cn("h-5 w-5", statusColor)} />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" align="start">
                    {CREDIT_CARD_STATUS_LABELS[status]}
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex text-center tracking-widest">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(parseFloat(spent))}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    Total gasto no mês
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Image src={imagePath} alt={type} width={40} height={25} />
          </div>

          <div className="flex justify-between">
            <div className="flex flex-col">
              <span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <div className="text-xs">Fechamento</div>{" "}
                      {statementCloseDay}/
                      {new Date(
                        new Date().setMonth(new Date().getMonth() + 1),
                      ).toLocaleString("pt-BR", { month: "2-digit" })}
                      /{new Date().getFullYear()}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start">
                    Data de fechamento do extrato
                  </TooltipContent>
                </Tooltip>
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <div className="text-xs">Vencimento</div> {dueDay}/
                    {new Date(
                      new Date().setMonth(new Date().getMonth() + 1),
                    ).toLocaleString("pt-BR", { month: "2-digit" })}
                    /{new Date().getFullYear()}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start">
                  Data de vencimento do extrato
                </TooltipContent>
              </Tooltip>
            </div>
            <Image src={imagePath} alt={type} width={40} height={25} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 w-80 space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Progress value={totalSpent} className="bg-popover" />
          </TooltipTrigger>
          <TooltipContent side="top" align="start">
            {`${totalSpent.toFixed(2)}%`}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center justify-between">
          Limite de{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(parseFloat(limit))}
          <DeleteCreditCardButton
            creditCardId={id}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </div>
      </div>
    </div>
  );
}
