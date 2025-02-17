import InvestmentSimulator from "./_components/investment-simulator";

const SimulatorPage = () => {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="mb-10 text-2xl font-bold">Simulador de Investimentos</h1>
        <div className="flex items-center gap-3"></div>
      </div>
      <div className="">
        <InvestmentSimulator />
      </div>
    </div>
  );
};

export default SimulatorPage;
