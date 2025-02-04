import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
// import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import EditCategoryDialog from "./edit-categories-dialog";
import { IconRenderer } from "@/app/_components/ui/icon-renderer";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  return (
    // <ScrollArea className="h-full rounded-md border pb-6">
    <Card className="border-3 flex h-full flex-col">
      <CardHeader className="flex items-center justify-center">
        <h3 className="text-lg font-semibold">Gastos por Categoria</h3>
      </CardHeader>
      <div className="flex-grow">
        <CardContent className="space-y-6">
          {expensesPerCategory.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
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
              <Progress value={category.percentageOfTotal} />
            </div>
          ))}
        </CardContent>
      </div>
      <CardContent className="flex w-full justify-center">
        <EditCategoryDialog />
      </CardContent>
    </Card>
    // </ScrollArea>
  );
};

export default ExpensesPerCategory;
