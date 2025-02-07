"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import {
  CheckCircle,
  BarChart,
  PieChart,
  LineChart,
  DollarSignIcon,
  Edit,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";

const availableCharts = [
  {
    name: "Distribuição de Transações",
    icon: <PieChart className="text-green-500" size={48} />,
    selected: false,
  },
  {
    name: "Meus Investimentos",
    icon: <DollarSignIcon className="text-purple-500" size={48} />,
    selected: false,
  },
  {
    name: "Gastos por Categoria",
    icon: <Menu className="text-orange-500" size={48} />,
    selected: false,
  },
  {
    name: "Fluxo Mensal",
    icon: <LineChart className="text-blue-500" size={48} />,
    selected: false,
  },
  {
    name: "Meus Objetivos",
    icon: <CheckCircle className="text-red-500" size={48} />,
    selected: false,
  },
  {
    name: "Fluxo Semestral de Despesas e Receitas",
    icon: <BarChart className="text-yellow-500" size={48} />,
    selected: false,
  },
];

function CustomizeHomeChartsDialog() {
  const [selectedCharts, setSelectedCharts] = useState(availableCharts);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCharts = localStorage.getItem("selectedCharts");
    if (savedCharts) {
      const savedChartNames = JSON.parse(savedCharts);
      const updatedCharts = availableCharts.map((chart) => ({
        ...chart,
        selected: savedChartNames.includes(chart.name),
      }));
      setSelectedCharts(updatedCharts);
    }
  }, []);

  const toggleChartSelection = (index: number) => {
    const newCharts = [...selectedCharts];
    const chart = newCharts[index];

    if (chart.selected) {
      chart.selected = false;
    } else if (newCharts.filter((c) => c.selected).length < 3) {
      chart.selected = true;
    }

    setSelectedCharts(newCharts);
  };

  const handleSave = () => {
    const selectedChartNames = selectedCharts
      .filter((chart) => chart.selected)
      .map((chart) => chart.name);

    localStorage.setItem("selectedCharts", JSON.stringify(selectedChartNames));
    window.location.reload();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="link"
            className="text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(true)}
          >
            <Edit style={{ height: "30px", width: "20px" }} />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-lg bg-white p-6 shadow-2xl transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Escolha os Gráficos
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Selecione até 3 gráficos para exibir na página inicial.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 grid grid-cols-2 gap-6">
          {selectedCharts.map((chart, index) => (
            <div
              key={index}
              className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border p-6 transition-shadow duration-200 hover:shadow-xl ${
                chart.selected ? "border-blue-500 bg-blue-50" : "bg-gray-50"
              }`}
              onClick={() => toggleChartSelection(index)}
            >
              <span className="text-center text-lg font-semibold">
                {chart.name}
              </span>
              <div className="mt-4">{chart.icon}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} variant="outline" className="px-6 py-2">
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomizeHomeChartsDialog;
