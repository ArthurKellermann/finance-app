import { z } from "zod";
import { Banks, CreditCardStatus, CreditCardType } from "@prisma/client";

export const upsertCreditCardSchema = z.object({
  description: z.string().trim().min(1),
  limit: z.number().positive({}).min(1),
  type: z.nativeEnum(CreditCardType),
  status: z.nativeEnum(CreditCardStatus),
  bank: z.nativeEnum(Banks),
  spent: z.number().min(0),
  statementCloseDay: z.string().min(1).max(31),
  dueDay: z.string().min(1).max(31),
});
