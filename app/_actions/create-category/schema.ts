import { z } from "zod";

export const createCategorySchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1),
  isDefault: z.boolean().default(false),
  icon: z.string().min(1),
  color: z.string().min(1),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
