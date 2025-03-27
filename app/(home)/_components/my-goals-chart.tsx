import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";
import ExpensesPerCategoryDialog from "./expenses-per-category-dialog";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  return (
    // <ScrollArea className="h-full rounded-md border pb-6">
    <Card className="card-shadow flex h-full flex-col">
      <CardHeader className="flex items-center justify-center">
        <h3 className="text-lg font-semibold">Minhas metas</h3>
      </CardHeader>
      <div className="flex-grow">
        <CardContent className="space-y-6">
          {expensesPerCategory.map((category) => (
            <div key={category.id} className="space-y-2">
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">
                    {TRANSACTION_CATEGORY_LABELS[
                      category.name as keyof typeof TRANSACTION_CATEGORY_LABELS
                    ] || category.name}
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
        <ExpensesPerCategoryDialog expensesPerCategory={expensesPerCategory} />
      </CardContent>
    </Card>
    // </ScrollArea>
  );
};

export default ExpensesPerCategory;
