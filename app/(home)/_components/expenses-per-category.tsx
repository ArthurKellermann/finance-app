import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { Progress } from "@/app/_components/ui/progress";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import { TRANSACTION_CATEGORY_LABELS } from "@/app/_constants/transactions";
import { TotalExpensePerCategory } from "@/app/_data/get-dashboard/types";
import Link from "next/link";

interface ExpensesPerCategoryProps {
  expensesPerCategory: TotalExpensePerCategory[];
}

const ExpensesPerCategory = ({
  expensesPerCategory,
}: ExpensesPerCategoryProps) => {
  return (
    <ScrollArea className="col-span-1 h-full rounded-md border pb-6">
      <Card className="border-3">
        <CardHeader className="flex items-center justify-center">
          <h3 className="text-lg font-semibold">Gastos por Categoria</h3>
        </CardHeader>

        <CardContent className="flex-grow space-y-6">
          {expensesPerCategory.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex w-full justify-between">
                <p className="text-sm font-bold">
                  {TRANSACTION_CATEGORY_LABELS[category.category]}
                </p>
                <p className="text-sm font-bold">
                  {category.percentageOfTotal}%
                </p>
              </div>
              <Progress value={category.percentageOfTotal} />
            </div>
          ))}
        </CardContent>
        <CardContent className="mt-4 flex w-full justify-center">
          <Button variant="link" asChild>
            <Link href="/">Gerenciar</Link>
          </Button>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default ExpensesPerCategory;
