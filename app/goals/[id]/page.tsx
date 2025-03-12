"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { cn } from "@/app/_lib/utils";
import { CheckCircle, Clock, XCircle, Ban } from "lucide-react";
import { GOALS_STATUS_LABELS } from "@/app/_constants/goals";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "@/app/_components/ui/tooltip";
import type { GoalStatus } from "@prisma/client";
import getGoalById from "../_actions/get-goal-by-id";
import AddDepositButton from "./_components/add-deposit-button";

interface GoalCardProps {
  id: string;
  name: string;
  description: string;
  status: GoalStatus;
  targetDate: Date;
  goalAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  userId: string;
  createdAt: Date;
  updatedAi: Date;
}

const statusIcons: Record<GoalStatus, { icon: any; color: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-500" },
  IN_PROGRESS: { icon: CheckCircle, color: "text-blue-500" },
  COMPLETED: { icon: CheckCircle, color: "text-green-500" },
  FAILED: { icon: XCircle, color: "text-red-500" },
  CANCELLED: { icon: Ban, color: "text-gray-500" },
};

export default function GoalDetailsPage() {
  const params = useParams();
  const [goal, setGoal] = useState<GoalCardProps | null>(null);

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const data = await getGoalById(params.id as string);
        setGoal(data);
      } catch (error) {
        console.error("Failed to fetch goal details:", error);
      }
    };

    fetchGoalDetails();
  }, [params.id]);

  if (!goal) {
    return <div>Carregando...</div>;
  }

  const progress = (goal.currentAmount / goal.goalAmount) * 100;

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
    <div className="p-6">
      <AddDepositButton goalId={goal.id} userCanAddCreditCard={true} />
      <Card
        className={cn(
          "relative h-64 w-full transform overflow-hidden rounded-xl p-6 shadow-lg",
          "bg-card text-card-foreground",
        )}
      >
        <CardContent className="flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{goal.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            </div>
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
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Data final
              </span>
              <span className="text-sm font-semibold">{formattedDate}</span>
            </div>

            <span className="text-xl font-bold font-medium">{`${progress.toFixed(2)}%`}</span>
          </div>

          <div className="flex items-center gap-3">
            <Progress
              value={progress}
              colorBar={goal.color}
              className="h-4 flex-1"
              style={{ backgroundColor: `var(--${goal.color}-200)` }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">
                {formattedCurrentAmount} / {formattedGoalAmount}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <StatusIcon className={cn("h-6 w-6", statusColor)} />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left" align="start">
                  {GOALS_STATUS_LABELS[goal.status]}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
