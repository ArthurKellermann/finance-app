import { z } from "zod";

export const deleteCategorySchema = z.object({
  categoryId: z.string().uuid(),
});

export type DeleteCategorySchema = z.infer<typeof deleteCategorySchema>;
