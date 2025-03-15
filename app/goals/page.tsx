import { auth } from "@clerk/nextjs/server";
import getGoals from "../_actions/get-goals";
import CreateGoalButton from "../_components/create-goal-button";
import { redirect } from "next/navigation";
import GoalCard from "./_components/goal-card";

const GoalsPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/get-started");
  }

  const goals = await getGoals();
  console.log("Goals:", goals);

  return (
    <>
      <div className="flex h-full flex-col space-y-6 overflow-hidden p-6">
        <div className="flex items-center justify-between gap-2">
          <h1 className="mb-10 text-2xl font-bold">Metas</h1>
          <div className="flex items-center gap-3">
            <CreateGoalButton userCanAddCreditCard={true} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {goals.length > 0 ? (
            goals.map((card: any) => <GoalCard key={card.id} {...card} />)
          ) : (
            <p className="text-gray-500">Nenhuma meta cadastrada.</p>
          )}
        </div>
      </div>
      ;
    </>
  );
};

export default GoalsPage;
