"use client";
import { useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { MoneyInput } from "@/app/_components/money-input";
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipTrigger,
} from "@/app/_components/ui/tooltip";

const InvestmentSimulator = () => {
  const [investmentType, setInvestmentType] = useState<string>(
    "CDB/LC/Títulos públicos/Debêntures",
  );
  const [fixedType, setFixedType] = useState<string>("PRÉ");
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [investmentDuration, setInvestmentDuration] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [results, setResults] = useState<any>(null);

  const CDI = 13.15;
  const IPCA = 4.56;

  const handleSimulation = () => {
    const data = [];
    let totalAmount = initialInvestment;
    let totalInvested = initialInvestment;
    let totalInterest = 0;

    const effectiveInterestRate =
      fixedType === "PÓS"
        ? (interestRate * CDI) / 100
        : fixedType === "IPCA"
          ? interestRate + IPCA
          : interestRate;

    for (let month = 1; month <= investmentDuration * 12; month++) {
      totalAmount += monthlyContribution;
      totalInvested += monthlyContribution;
      totalAmount *= 1 + effectiveInterestRate / 100 / 12;
      totalInterest = totalAmount - totalInvested;
      data.push({ month, totalAmount, totalInvested, totalInterest });
    }

    const taxRate =
      investmentType === "LCI/LCA" ? 0 : calculateTaxRate(investmentDuration);
    const taxAmount = totalInterest * taxRate;
    const netAmount = totalAmount - taxAmount;

    setSimulationData(data);
    setResults({
      totalAmount,
      totalInvested,
      totalInterest,
      taxRate: taxRate * 100,
      taxAmount,
      netAmount,
    });
  };

  const calculateTaxRate = (years: number) => {
    if (years <= 1) return 0.225;
    if (years <= 2) return 0.2;
    if (years <= 3) return 0.175;
    return 0.15;
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(simulationData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Simulação");
    XLSX.writeFile(
      workbook,
      `SimualcaoInvestimentos-${new Date().toISOString()}.xlsx`,
    );
  };

  const pieChartData = [
    { name: "Valor Investido", value: results?.totalInvested || 0 },
    { name: "Juros Acumulados", value: results?.totalInterest || 0 },
  ];

  const COLORS = ["#82ca9d", "#8884d8"];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Investimentos - Renda Fixa</CardTitle>
          <CardDescription>
            Simule seus investimentos e veja os resultados detalhados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">
                <TooltipPrimitive>
                  <TooltipTrigger asChild>
                    <span>Tipo de Investimento *</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    O simulador classifica os investimentos em duas categorias{" "}
                    <br />
                    com base nas regras de tributação. Enquanto as LCIs e LCAs{" "}
                    <br />
                    não têm imposto de renda, os outros ativos estão sujeitos à{" "}
                    <br />
                    tabela regressiva.
                  </TooltipContent>
                </TooltipPrimitive>
              </label>
              <Select value={investmentType} onValueChange={setInvestmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDB/LC/Títulos públicos/Debêntures">
                    CDB/LC/Títulos públicos/Debêntures
                  </SelectItem>
                  <SelectItem value="LCI/LCA">LCI/LCA</SelectItem>
                  <SelectItem value="Tesouro Direto">Tesouro Direto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">
                <TooltipPrimitive>
                  <TooltipTrigger asChild>
                    <span>É PRÉ fixado ou PÓS fixado? *</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    Os títulos prefixados oferecem rendimento baseado em uma{" "}
                    <br />
                    taxa fixa, enquanto os pós-fixados rendem conforme uma{" "}
                    <br />
                    porcentagem do CDI, e os títulos atrelados ao IPCA <br />
                    proporcionam rendimento de uma taxa fixa somada ao IPCA.{" "}
                    <br />
                  </TooltipContent>
                </TooltipPrimitive>
              </label>
              <Select value={fixedType} onValueChange={setFixedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRÉ">PRÉ</SelectItem>
                  <SelectItem value="PÓS">PÓS</SelectItem>
                  <SelectItem value="IPCA">IPCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">
                Investimento Inicial
              </label>
              <MoneyInput
                value={initialInvestment}
                onValueChange={({ floatValue }) =>
                  setInitialInvestment(Number(floatValue))
                }
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Aporte Mensal</label>
              <MoneyInput
                value={monthlyContribution}
                onValueChange={({ floatValue }) =>
                  setMonthlyContribution(Number(floatValue))
                }
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Prazo (em anos)</label>
              <Input
                type="string"
                value={investmentDuration}
                onChange={(e) => setInvestmentDuration(Number(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">
                <TooltipPrimitive>
                  <TooltipTrigger asChild>
                    <span>Rentabilidade (%) *</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end">
                    Se você optou por um título prefixado, insira a taxa que{" "}
                    <br />
                    você acredita que seu investimento irá render ao longo de{" "}
                    <br />
                    todo o período. Para títulos pós-fixados, informe a <br />
                    porcentagem do CDI que seu título oferece. No caso de <br />
                    títulos atrelados ao IPCA, saiba que eles rendem IPCA + uma{" "}
                    <br />
                    taxa prefixada, então indique a sua estimativa para essa{" "}
                    <br />
                    taxa prefixada.
                  </TooltipContent>
                </TooltipPrimitive>
              </label>

              <Input
                type="string"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
              />
            </div>
          </div>
          <Button onClick={handleSimulation} className="mt-6 w-full sm:w-auto">
            Calcular
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados da Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Tipo de Investimento</p>
                  <p className="text-lg font-semibold">{investmentType}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    É PRÉ fixado ou PÓS fixado?
                  </p>
                  <p className="text-lg font-semibold">{fixedType}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Investimento Inicial</p>
                  <p className="text-lg font-semibold">
                    R$ {initialInvestment.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Aporte Mensal</p>
                  <p className="text-lg font-semibold">
                    R$ {monthlyContribution.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Prazo</p>
                  <p className="text-lg font-semibold">
                    {investmentDuration} anos
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Rentabilidade</p>
                  <p className="text-lg font-semibold">{interestRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor Total Bruto</p>
                  <p className="text-lg font-semibold">
                    R$ {results.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor Investido</p>
                  <p className="text-lg font-semibold">
                    R$ {results.totalInvested.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor em Juros</p>
                  <p className="text-lg font-semibold">
                    R$ {results.totalInterest.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Imposto de Renda</p>
                  <p className="text-lg font-semibold">
                    {results.taxRate.toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor Pago em IR</p>
                  <p className="text-lg font-semibold">
                    R$ {results.taxAmount.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor Total Líquido</p>
                  <p className="text-lg font-semibold">
                    R$ {results.netAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gráfico do Crescimento do Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="totalAmount"
                    stroke="#8884d8"
                    name="Valor Acumulado"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição dos Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(2)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalhes Mensais</CardTitle>
                <Button
                  onClick={handleExportToExcel}
                  className="text-bg-secondary-foreground gap-2"
                  variant="link"
                >
                  <Download size={16} />
                  Exportar para Excel
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Valor Acumulado</TableHead>
                      <TableHead>Valor Investido</TableHead>
                      <TableHead>Juros Acumulados</TableHead>
                      <TableHead>Imposto de Renda</TableHead>
                      <TableHead>Valor Líquido</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationData.map((row, index) => {
                      const taxRate =
                        investmentType === "LCI/LCA"
                          ? 0
                          : calculateTaxRate(investmentDuration);
                      const taxAmount = row.totalInterest * taxRate;
                      const netAmount = row.totalAmount - taxAmount;
                      return (
                        <TableRow key={index}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>R$ {row.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            R$ {row.totalInvested.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            R$ {row.totalInterest.toFixed(2)}
                          </TableCell>
                          <TableCell>R$ {taxAmount.toFixed(2)}</TableCell>
                          <TableCell>R$ {netAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InvestmentSimulator;
