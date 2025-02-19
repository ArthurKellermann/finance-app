import { GoalStatus } from "@prisma/client";
import { z } from "zod";

export const upsertGoalSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.nativeEnum(GoalStatus),
  targetDate: z.string(),
  goalAmount: z.string(),
  startingAmount: z.string(),
  color: z.string().min(1),
  iconPath: z.string().min(1),
});

export type UpsertGoalSchema = z.infer<typeof upsertGoalSchema>;
