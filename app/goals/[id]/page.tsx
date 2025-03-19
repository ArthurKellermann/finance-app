"use client";

import { useCallback, useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { Card, CardContent } from "@/app/_components/ui/card";
import { cn } from "@/app/_lib/utils";
import { CheckCircle, Clock, XCircle, Ban } from "lucide-react";
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
  PENDING: { icon: Clock, color: "text-yellow-500" },
  IN_PROGRESS: { icon: CheckCircle, color: "text-blue-500" },
  COMPLETED: { icon: CheckCircle, color: "text-green-500" },
  FAILED: { icon: XCircle, color: "text-red-500" },
  CANCELLED: { icon: Ban, color: "text-gray-500" },
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
      <div className="text-center text-lg font-semibold text-gray-700">
        Carregando...
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Detalhes da Meta</h1>
        <AddDepositButton
          goalId={goal.id}
          userCanAddDeposit={true}
          onDepositAdded={handleDepositChange}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-lg shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="flex-shrink-0"></div>

              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{goal.name}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <StatusIcon
                              className={cn("h-5 w-5", statusColor)}
                            />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start">
                          {GOALS_STATUS_LABELS[goal.status]}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2"></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Valor atual:
                    </span>
                    <span className="text-lg font-bold">
                      {formattedCurrentAmount}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Valor total:
                    </span>
                    <span className="text-lg font-bold">
                      {formattedGoalAmount}
                    </span>
                  </div>
                  <div className="flex flex-1 justify-end"></div>
                </div>
              </div>
              <CurrentGoalAmountPieChart
                currentAmount={goal.currentAmount}
                goalAmount={goal.goalAmount}
                color={goal.color}
              />
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md text-3xl"
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
            <div className="mt-8">
              <DepositsLastTwelveMonthsBarChart deposits={deposits || []} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Depósitos</h2>
          <DataTable
            columns={getDepositColumns(handleDepositChange)}
            data={JSON.parse(JSON.stringify(deposits)) || []}
          />
        </div>
      </div>
    </div>
  );
}
