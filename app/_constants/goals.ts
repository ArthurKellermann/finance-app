import { GoalStatus } from "@prisma/client";

export const GOALS_STATUS_LABELS = {
  [GoalStatus.PENDING]: "Pendente",
  [GoalStatus.IN_PROGRESS]: "Em progresso",
  [GoalStatus.COMPLETED]: "Concluído",
  [GoalStatus.FAILED]: "Falhou",
  [GoalStatus.CANCELLED]: "Cancelado",
};
