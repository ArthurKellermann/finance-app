import { TransactionType } from "@prisma/client";

export type TransactionPercentagePerType = {
  [key in TransactionType]: number;
};

export interface TotalExpensePerCategory {
  id: string;
  name?: string;
  icon?: string;
  color?: string;
  totalAmount: number;
  percentageOfTotal: number;
}
