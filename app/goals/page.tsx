import CreateGoalButton from "../_components/create-goal-button";

const Goals = () => {
  return (
    <>
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Metas</h1>
          <CreateGoalButton userCanAddCreditCard={true} />
        </div>
      </div>
    </>
  );
};

export default Goals;
