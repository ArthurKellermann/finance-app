"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  DollarSign,
  Edit,
  Menu,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/app/_hooks/use-toast";

const availableCharts = [
  {
    name: "Distribuição de Transações",
    icon: <PieChart className="h-16 w-16 text-green-500" />,
    selected: false,
    size: 1,
  },
  {
    name: "Meus Investimentos",
    icon: <DollarSign className="h-16 w-16 text-purple-500" />,
    selected: false,
    size: 1,
  },
  {
    name: "Gastos por Categoria",
    icon: <Menu className="h-16 w-16 text-orange-500" />,
    selected: false,
    size: 1,
  },
  {
    name: "Fluxo Mensal",
    icon: <LineChart className="h-16 w-16 text-blue-500" />,
    selected: false,
    size: 2,
  },
  {
    name: "Meus Objetivos",
    icon: <CheckCircle className="h-16 w-16 text-red-500" />,
    selected: false,
    size: 1,
  },
  {
    name: "Fluxo Semestral de Despesas e Receitas",
    icon: <BarChart className="h-16 w-16 text-yellow-500" />,
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
      const defaultCharts = [
        availableCharts[0].name,
        availableCharts[1].name,
        availableCharts[2].name,
      ];
      localStorage.setItem("selectedCharts", JSON.stringify(defaultCharts));
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
        title: "❌ Limite de gráficos atingido",
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
        <Button
          variant="ghost"
          className="flex h-10 w-10 items-center justify-center rounded-full p-0 text-muted-foreground hover:bg-gray-100 hover:text-primary"
          onClick={() => setIsOpen(true)}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden rounded-xl border-none p-0 shadow-lg sm:max-w-2xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
              <div className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-blue-600" />
                Personalizar Dashboard
              </div>
            </DialogTitle>
            <DialogDescription>
              Selecione até 3 gráficos para exibir na página inicial
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {selectedCharts.map((chart, index) => (
              <div
                key={index}
                onClick={() => toggleChartSelection(index)}
                className={`flex cursor-pointer flex-col items-center justify-between rounded-lg border p-6 transition-all duration-200 hover:shadow-md ${
                  chart.selected
                    ? "border-blue-500 bg-blue-50 shadow"
                    : "border-gray-200 bg-white"
                }`}
              >
                <span className="mb-3 text-center text-base font-medium text-gray-700">
                  {chart.name}
                </span>
                <div className="mt-3">{chart.icon}</div>
                <div className="mt-4 text-sm text-gray-500">
                  {chart.size === 1 ? "Tamanho padrão" : "Tamanho duplo"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-500" />
            <p className="text-sm text-yellow-800">
              Os gráficos de tamanho duplo ocupam dois espaços no dashboard.
            </p>
          </div>

          <DialogFooter className="mt-6 flex gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-lg border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleSave}
              className="flex-1 rounded-lg border-none bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CustomizeHomeChartsDialog;
