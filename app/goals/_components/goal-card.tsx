"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { cn } from "@/app/_lib/utils";
import { GoalStatus } from "@prisma/client";
import {
  Ban,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  Target,
  TrendingUp,
} from "lucide-react";
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
import { completeGoal } from "@/app/_actions/complete-goal";

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
  PENDING: { icon: Clock, color: "text-yellow-600" },
  IN_PROGRESS: { icon: TrendingUp, color: "text-blue-600" },
  COMPLETED: { icon: CheckCircle, color: "text-green-600" },
  FAILED: { icon: XCircle, color: "text-red-600" },
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
    await completeGoal({
      id: goal.id,
    });
  };

  const { icon: StatusIcon, color: statusColor } = statusIcons[goal.status];

  return (
    <div className="space-y-6">
      <Card
        className="transform overflow-hidden rounded-xl border-none bg-white shadow-lg transition-transform hover:scale-[1.02]"
        onClick={handleClick}
      >
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6" />
            <h2 className="text-xl font-bold">{goal.name}</h2>
          </div>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
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
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          <p className="text-sm text-gray-600">{goal.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Data Final</p>
              <p className="text-sm font-semibold text-gray-800">
                {formattedDate}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-right">
              <p className="text-xs text-gray-500">Progresso</p>
              <p className="text-lg font-bold text-blue-700">{`${progress.toFixed(2)}%`}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Progress
              value={progress}
              colorBar={goal.color}
              className="h-3 w-full"
              style={{ backgroundColor: `var(--${goal.color}-200)` }}
            />
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-700">
                {formattedCurrentAmount}
              </span>
              <span className="font-semibold text-gray-700">
                {formattedGoalAmount}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <StatusIcon className={cn("h-6 w-6", statusColor)} />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {GOALS_STATUS_LABELS[goal.status]}
              </TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-center space-x-4">
            {goal.status !== "COMPLETED" && (
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-full border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleCompleteGoal}
              >
                <Check className="h-4 w-4" />
                Concluir meta
              </Button>
            )}

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <span>
                <EditGoalButton goal={goal} />
              </span>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border-red-500 text-red-600 hover:bg-red-50"
              asChild
            >
              <span>
                <DeleteGoalButton
                  goalId={goal.id}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              </span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
