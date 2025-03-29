"use client";
import { Card, CardContent } from "@/app/_components/ui/card";
import { cn } from "@/app/_lib/utils";
import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Clock,
  Calendar,
  CreditCard as CreditCardIcon,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { CREDIT_CARD_STATUS_LABELS } from "@/app/_constants/credit-cards";
import { useRouter } from "next/navigation";

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
  { icon: any; color: string; bgColor: string }
> = {
  ACTIVE: {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  SUSPENDED: {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  BLOCKED: { icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" },
  EXPIRED: { icon: Clock, color: "text-gray-600", bgColor: "bg-gray-100" },
  CANCELLED: { icon: Ban, color: "text-red-700", bgColor: "bg-red-100" },
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
  const router = useRouter();
  // const [isDeleted, setIsDeleted] = useState(false);

  // const handleDeleteSuccess = () => {
  //   setIsDeleted(true);
  // };

  // if (isDeleted) return null;

  const totalSpent = (parseFloat(spent) / parseFloat(limit)) * 100;
  const {
    icon: StatusIcon,
    color: statusColor,
    bgColor: statusBgColor,
  } = statusIcons[status];

  const handleClick = () => {
    router.push(`/credit-cards/${id}`);
  };

  // Generate gradient based on card status
  const getCardGradient = () => {
    switch (status) {
      case "ACTIVE":
        return "from-blue-500 via-indigo-500 to-purple-600";
      case "SUSPENDED":
        return "from-yellow-400 via-amber-500 to-orange-600";
      case "BLOCKED":
      case "CANCELLED":
        return "from-red-400 via-red-500 to-red-600";
      case "EXPIRED":
        return "from-gray-400 via-gray-500 to-gray-600";
      default:
        return "from-blue-500 via-indigo-500 to-purple-600";
    }
  };

  return (
    <div className="group">
      <Card
        className={cn(
          "relative h-60 w-80 transform cursor-pointer overflow-hidden rounded-xl p-0 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl",
          `bg-gradient-to-br ${getCardGradient()}`,
        )}
        onClick={handleClick}
      >
        {/* Card glass effect overlay */}
        <div className="absolute inset-0 bg-white opacity-5 backdrop-blur-sm"></div>

        {/* Card content */}
        <CardContent className="relative z-10 flex h-full flex-col justify-between p-5">
          {/* Card header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-white/80" />
                <span className="text-lg font-bold">{description}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`${statusBgColor} ${statusColor} flex items-center gap-1 rounded-full px-2 py-0.5 text-xs`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {CREDIT_CARD_STATUS_LABELS[status]}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="start"
                    className="bg-gray-800 text-white"
                  >
                    Status do cartão
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <Image
              src={imagePath}
              alt={type}
              width={50}
              height={30}
              className="rounded-md object-contain shadow-sm"
            />
          </div>

          {/* Card middle section */}
          <div className="my-4">
            <div className="mb-1 text-xs text-white/70">Total gasto no mês</div>
            <div className="text-2xl font-bold tracking-wide">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(parseFloat(spent))}{" "}
              /{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(parseFloat(limit))}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${totalSpent}%` }}
                  ></div>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                className="bg-gray-800 text-white"
              >
                {`${totalSpent.toFixed(1)}% do limite utilizado`}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Card footer */}
          <div className="flex items-end justify-between">
            <div className="flex gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Calendar className="h-3 w-3" />
                      Fechamento
                    </div>
                    <span className="text-sm font-medium">
                      {statementCloseDay}/
                      {new Date(
                        new Date().setMonth(new Date().getMonth() + 1),
                      ).toLocaleString("pt-BR", { month: "2-digit" })}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="bg-gray-800 text-white"
                >
                  Data de fechamento da fatura
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-xs text-white/70">
                      <Wallet className="h-3 w-3" />
                      Vencimento
                    </div>
                    <span className="text-sm font-medium">
                      {dueDay}/
                      {new Date(
                        new Date().setMonth(new Date().getMonth() + 1),
                      ).toLocaleString("pt-BR", { month: "2-digit" })}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  className="bg-gray-800 text-white"
                >
                  Data de vencimento da fatura
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="rounded-full bg-white/20 px-2 py-1 text-xs">
              {type}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <DeleteCreditCardButton
            creditCardId={id}
            onDeleteSuccess={handleDeleteSuccess} */}
    </div>
  );
}
