import { GoalStatus } from "@prisma/client";
import { z } from "zod";

export const upsertGoalSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  status: z.nativeEnum(GoalStatus),
  targetDate: z.date(),
  goalAmount: z.number().positive(),
  startingAmount: z.number().positive(),
  color: z.string().min(1),
  iconPath: z.string().min(1),
});

export type UpsertGoalSchema = z.infer<typeof upsertGoalSchema>;
