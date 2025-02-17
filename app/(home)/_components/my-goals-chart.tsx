import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import EditCategoryDialog from "./edit-categories-dialog";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";

interface MyGoalsProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const MyGoalsChart = ({ expensesPerCategory }: MyGoalsProps) => {
  return (
    <Card className="border-3 flex h-full flex-col">
      <CardHeader className="flex items-center justify-center">
        <h3 className="text-lg font-semibold">Meus Objetivos</h3>
      </CardHeader>
      <div className="flex-grow">
        <CardContent className="space-y-6">
          {expensesPerCategory.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">
                    {TRANSACTION_CATEGORY_LABELS[
                      category.category as keyof typeof TRANSACTION_CATEGORY_LABELS
                    ] || category.category}
                  </p>
                  <IconRenderer
                    icon={category.icon as string}
                    className="h-4 w-4"
                  />
                </div>
                <p className="text-sm font-bold">
                  {category.percentageOfTotal}%
                </p>
              </div>

              <Progress
                value={category.percentageOfTotal}
                style={
                  {
                    "--progress-foreground": category.color,
                  } as React.CSSProperties
                }
                className="[&>div]:!bg-[var(--progress-foreground)]"
              />
            </div>
          ))}
        </CardContent>
      </div>
      <CardContent className="flex w-full justify-center">
        <EditCategoryDialog />
      </CardContent>
    </Card>
  );
};

export default MyGoalsChart;
