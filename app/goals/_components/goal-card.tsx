"use client";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { cn } from "@/app/_lib/utils";
import { GoalStatus } from "@prisma/client";
import { Ban, CheckCircle, Clock, XCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import { GOALS_STATUS_LABELS } from "@/app/_constants/goals";
import DeleteGoalButton from "./delete-goal-button";
import { useState } from "react";
import EditGoalButton from "./edit-goal-button";

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

export default function GoalCard(goal: GoalCardProps) {
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteSuccess = () => {
    setIsDeleted(true);
  };

  if (isDeleted) return null;

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

  const handleClick = () => {
    router.push(`/goals/${goal.id}`);
  };

  const handleCompleteGoal = async (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const { icon: StatusIcon, color: statusColor } = statusIcons[goal.status];

  return (
    <div>
      <Card
        className={cn(
          "relative h-64 w-full transform cursor-pointer overflow-hidden rounded-xl p-6 shadow-lg transition-transform duration-300 hover:scale-105",
          "bg-card text-card-foreground",
        )}
        onClick={handleClick}
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

      <div className="mt-4 flex">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          onClick={handleCompleteGoal}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Check className="h-5 w-5" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              Concluir meta
            </TooltipContent>
          </Tooltip>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <EditGoalButton goal={goal} />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            Editar meta
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <DeleteGoalButton
                goalId={goal.id}
                onDeleteSuccess={handleDeleteSuccess}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            Deletar meta
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
