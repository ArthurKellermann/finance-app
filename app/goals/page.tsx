import { auth } from "@clerk/nextjs/server";
import getGoals from "../_actions/get-goals";
import CreateGoalButton from "../_components/create-goal-button";
import { redirect } from "next/navigation";
import GoalCard from "./_components/goal-card";
import { Target, ChartLine } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/app/_components/ui/card";

const GoalsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/get-started");
  }

  const goals = await getGoals();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <Target className="h-8 w-8" />
              Metas Financeiras
            </CardTitle>
            <p className="mt-1 text-sm text-white/80">
              Planeje e acompanhe seus objetivos
            </p>
          </div>
          <CreateGoalButton userCanAddCreditCard={true} />
        </CardHeader>

        <div className="p-6">
          {goals.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {goals.map((card: any) => (
                <div
                  key={card.id}
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <GoalCard {...card} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
              <ChartLine className="mb-4 h-16 w-16 text-gray-300" />
              <p className="mb-2 text-lg text-gray-600">
                Nenhuma meta cadastrada ainda
              </p>
              <p className="max-w-md text-sm text-gray-400">
                Comece a planejar seus objetivos financeiros criando sua
                primeira meta
              </p>
              <div className="mt-6">
                <CreateGoalButton userCanAddCreditCard={true} />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GoalsPage;
