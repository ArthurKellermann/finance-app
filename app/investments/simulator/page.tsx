import InvestmentSimulator from "./_components/investment-simulator";

const SimulatorPage = () => {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex items-center justify-between gap-2"></div>
      <div className="">
        <InvestmentSimulator />
      </div>
    </div>
  );
};

export default SimulatorPage;
