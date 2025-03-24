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
import { useToast } from "@/app/_hooks/use-toast";

const availableCharts = [
  {
    name: "Distribuição de Transações",
    icon: <PieChart className="text-green-500" size={48} />,
    selected: false,
    size: 1,
  },
  {
    name: "Meus Investimentos",
    icon: <DollarSignIcon className="text-purple-500" size={48} />,
    selected: false,
    size: 1,
  },
  {
    name: "Gastos por Categoria",
    icon: <Menu className="text-orange-500" size={48} />,
    selected: false,
    size: 1,
  },
  {
    name: "Fluxo Mensal",
    icon: <LineChart className="text-blue-500" size={48} />,
    selected: false,
    size: 2,
  },
  {
    name: "Meus Objetivos",
    icon: <CheckCircle className="text-red-500" size={48} />,
    selected: false,
    size: 1,
  },
  {
    name: "Fluxo Semestral de Despesas e Receitas",
    icon: <BarChart className="text-yellow-500" size={48} />,
    selected: false,
    size: 2,
  },
];

function CustomizeHomeChartsDialog() {
  const [selectedCharts, setSelectedCharts] = useState(availableCharts);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

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

    if (!savedCharts) {
      localStorage.setItem(
        "selectedCharts",
        JSON.stringify([
          availableCharts[0],
          availableCharts[1],
          availableCharts[2],
        ]),
      );
    }
  }, []);

  const toggleChartSelection = (index: number) => {
    const newCharts = [...selectedCharts];
    const chart = newCharts[index];

    const currentSize = newCharts.reduce(
      (acc, c) => acc + (c.selected ? c.size : 0),
      0,
    );

    if (chart.selected) {
      chart.selected = false;
    } else if (currentSize + chart.size <= 3) {
      chart.selected = true;
    } else {
      toast({
        title: "❌ Erro",
        description: "Você só pode selecionar até 3 espaços de gráficos!",
      });
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
      <DialogContent className="max-w-lg rounded-lg bg-background p-6 shadow-2xl transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-card-foreground">
            Escolha os Gráficos
          </DialogTitle>
          <DialogDescription className="text-foreground">
            Selecione até 3 gráficos para exibir na página inicial.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 grid grid-cols-2 gap-6">
          {selectedCharts.map((chart, index) => (
            <div
              key={index}
              className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border p-6 transition-shadow duration-200 hover:shadow-xl ${
                chart.selected ? "border-blue-500 bg-card" : "bg-card"
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
