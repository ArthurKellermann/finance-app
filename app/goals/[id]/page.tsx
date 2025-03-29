"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { cn } from "@/app/_lib/utils";
import {
  CheckCircle,
  Clock,
  XCircle,
  Ban,
  Target,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { GOALS_STATUS_LABELS } from "@/app/_constants/goals";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/app/_components/ui/tooltip";
import type { Goal, GoalDeposit, GoalStatus } from "@prisma/client";
import getGoalById from "../_actions/get-goal-by-id";
import AddDepositButton from "./_components/add-deposit-button";
import { getDepositsByGoalId } from "@/app/_actions/get-deposits-by-goal-id";
import { DataTable } from "./_columns/data-table";
import { getDepositColumns } from "./_columns";
import { CurrentGoalAmountPieChart } from "./_components/current-goal-amount-pie-chart";
import { IconRenderer } from "@/app/_components/ui/use-icon-picker";
import { useAuth } from "@clerk/nextjs";
import { DepositsLastTwelveMonthsBarChart } from "./_components/deposits-last-twelve-months-bar-chart";

const statusIcons: Record<GoalStatus, { icon: any; color: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-600" },
  IN_PROGRESS: { icon: CheckCircle, color: "text-blue-600" },
  COMPLETED: { icon: CheckCircle, color: "text-green-600" },
  FAILED: { icon: XCircle, color: "text-red-600" },
  CANCELLED: { icon: Ban, color: "text-gray-600" },
};

export default function GoalDetailsPage() {
  const { userId } = useAuth();

  if (!userId) {
    redirect("/get-started");
  }

  const params = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [deposits, setDeposits] = useState<GoalDeposit[] | null>(null);

  const fetchGoalDetails = useCallback(async () => {
    try {
      const data = await getGoalById(params.id as string);
      setGoal(data);
    } catch (error) {
      console.error("Failed to fetch goal details:", error);
    }
  }, [params.id]);

  const fetchDeposits = useCallback(async () => {
    try {
      const data = await getDepositsByGoalId(params.id as string);
      setDeposits(data);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
    }
  }, [params.id]);

  const handleDepositChange = useCallback(async () => {
    await fetchGoalDetails();
    await fetchDeposits();
  }, [fetchGoalDetails, fetchDeposits]);

  useEffect(() => {
    fetchGoalDetails();
    fetchDeposits();
  }, [fetchGoalDetails, fetchDeposits]);

  if (!goal) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        <div className="flex flex-col items-center space-y-4">
          <Target className="h-12 w-12 animate-pulse text-blue-500" />
          <p className="text-lg font-semibold">Carregando meta...</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(goal.targetDate));

  const formattedGoalAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(goal.goalAmount);

  const formattedCurrentAmount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(goal.currentAmount);

  const { icon: StatusIcon, color: statusColor } = statusIcons[goal.status];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <Target className="h-8 w-8 text-blue-600" />
            Detalhes da Meta
          </h1>
          <AddDepositButton
            goalId={goal.id}
            userCanAddDeposit={true}
            onDepositAdded={handleDepositChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Target className="h-6 w-6" />
                  {goal.name}
                </CardTitle>
                <p className="text-sm text-white/80">{goal.description}</p>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <StatusIcon className={cn("h-6 w-6", statusColor)} />
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="end"
                  className="bg-gray-800 text-white"
                >
                  {GOALS_STATUS_LABELS[goal.status]}
                </TooltipContent>
              </Tooltip>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Data Limite</p>
                    <p className="font-semibold text-gray-800">
                      {formattedDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Progresso</p>
                    <p className="font-semibold text-gray-800">
                      {((goal.currentAmount / goal.goalAmount) * 100).toFixed(
                        1,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Valor Atual</p>
                  <p className="text-xl font-bold text-green-600">
                    {formattedCurrentAmount}
                  </p>
                </div>
                <div>
                  <p className="text-right text-sm text-gray-500">
                    Valor Total
                  </p>
                  <p className="text-right text-xl font-bold text-blue-600">
                    {formattedGoalAmount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <CurrentGoalAmountPieChart
                  currentAmount={goal.currentAmount}
                  goalAmount={goal.goalAmount}
                  color={goal.color}
                />
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full shadow-md"
                  style={{ backgroundColor: goal.color }}
                >
                  <IconRenderer
                    icon={goal.icon}
                    style={{
                      height: "1.5rem",
                      width: "1.5rem",
                      color: "white",
                    }}
                  />
                </div>
              </div>

              <div>
                <DepositsLastTwelveMonthsBarChart deposits={deposits || []} />
              </div>
            </CardContent>
          </Card>

          <DataTable
            columns={getDepositColumns(handleDepositChange)}
            data={JSON.parse(JSON.stringify(deposits)) || []}
          />
        </div>
      </div>
    </div>
  );
}
