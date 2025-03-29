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
  CardFooter,
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
import {
  Download,
  Calculator,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Table as TableIcon,
  Info,
  FileText,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
} from "lucide-react";
import * as XLSX from "xlsx";
import { MoneyInput } from "@/app/_components/money-input";
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
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

  const COLORS = ["#4ade80", "#8b5cf6"];

  return (
    <TooltipProvider>
      <div className="space-y-6 p-4">
        <Card className="overflow-hidden rounded-xl border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6" />
              <CardTitle>Simulador de Investimentos - Renda Fixa</CardTitle>
            </div>
            <CardDescription className="text-white/80">
              Simule seus investimentos e visualize projeções detalhadas do seu
              patrimônio.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <TooltipPrimitive>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        Tipo de Investimento
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="start"
                      className="max-w-sm bg-white p-2 text-gray-700 shadow-lg"
                    >
                      O simulador classifica os investimentos em duas categorias
                      com base nas regras de tributação. Enquanto as LCIs e LCAs
                      não têm imposto de renda, os outros ativos estão sujeitos
                      à tabela regressiva.
                    </TooltipContent>
                  </TooltipPrimitive>
                </label>
                <Select
                  value={investmentType}
                  onValueChange={setInvestmentType}
                >
                  <SelectTrigger className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CDB/LC/Títulos públicos/Debêntures">
                      CDB/LC/Títulos públicos/Debêntures
                    </SelectItem>
                    <SelectItem value="LCI/LCA">LCI/LCA</SelectItem>
                    <SelectItem value="Tesouro Direto">
                      Tesouro Direto
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Percent className="h-4 w-4 text-gray-500" />
                  <TooltipPrimitive>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        Tipo de Rentabilidade
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="start"
                      className="max-w-sm bg-white p-2 text-gray-700 shadow-lg"
                    >
                      Os títulos prefixados oferecem rendimento baseado em uma
                      taxa fixa, enquanto os pós-fixados rendem conforme uma
                      porcentagem do CDI, e os títulos atrelados ao IPCA
                      proporcionam rendimento de uma taxa fixa somada ao IPCA.
                    </TooltipContent>
                  </TooltipPrimitive>
                </label>
                <Select value={fixedType} onValueChange={setFixedType}>
                  <SelectTrigger className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500">
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
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Investimento Inicial
                </label>
                <MoneyInput
                  className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500"
                  value={initialInvestment}
                  onValueChange={({ floatValue }) =>
                    setInitialInvestment(Number(floatValue))
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Aporte Mensal
                </label>
                <MoneyInput
                  className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500"
                  value={monthlyContribution}
                  onValueChange={({ floatValue }) =>
                    setMonthlyContribution(Number(floatValue))
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Prazo (em anos)
                </label>
                <Input
                  type="number"
                  className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500"
                  value={investmentDuration}
                  onChange={(e) =>
                    setInvestmentDuration(Number(e.target.value))
                  }
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                  <TooltipPrimitive>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1">
                        Rentabilidade (%)
                        <Info className="h-3.5 w-3.5 text-gray-400" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="start"
                      className="max-w-sm bg-white p-2 text-gray-700 shadow-lg"
                    >
                      Se você optou por um título prefixado, insira a taxa que
                      você acredita que seu investimento irá render ao longo de
                      todo o período. Para títulos pós-fixados, informe a
                      porcentagem do CDI que seu título oferece. No caso de
                      títulos atrelados ao IPCA, saiba que eles rendem IPCA +
                      uma taxa prefixada, então indique a sua estimativa para
                      essa taxa prefixada.
                    </TooltipContent>
                  </TooltipPrimitive>
                </label>
                <Input
                  type="number"
                  className="border-gray-200 bg-white hover:bg-gray-50 focus:ring-blue-500"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>
            </div>

            <Button
              onClick={handleSimulation}
              className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:from-blue-700 hover:to-purple-700"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Projeção
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-xl border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <CardTitle>Parâmetros da Simulação</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tipo de Investimento
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                      {investmentType}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Tipo de Rentabilidade
                    </p>
                    <p className="text-lg font-semibold text-purple-700">
                      {fixedType}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Investimento Inicial
                    </p>
                    <p className="text-lg font-semibold text-green-700">
                      R${" "}
                      {initialInvestment.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Aporte Mensal
                    </p>
                    <p className="text-lg font-semibold text-blue-700">
                      R${" "}
                      {monthlyContribution.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-4">
                    <p className="text-sm font-medium text-gray-500">Prazo</p>
                    <p className="text-lg font-semibold text-purple-700">
                      {investmentDuration}{" "}
                      {investmentDuration === 1 ? "ano" : "anos"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Rentabilidade
                    </p>
                    <p className="text-lg font-semibold text-green-700">
                      {interestRate}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  <CardTitle>Resultados Financeiros</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Valor Total Bruto
                    </p>
                    <p className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                      R${" "}
                      {results.totalAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Valor Investido
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      R${" "}
                      {results.totalInvested.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Valor em Juros
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      R${" "}
                      {results.totalInterest.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Imposto de Renda
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {results.taxRate.toFixed(2)}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Valor Pago em IR
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      R${" "}
                      {results.taxAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                      Valor Total Líquido
                    </p>
                    <p className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-2xl font-bold text-transparent">
                      R${" "}
                      {results.netAmount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="overflow-hidden rounded-xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <div className="flex items-center gap-2">
                    <LineChartIcon className="h-6 w-6" />
                    <CardTitle>Evolução do Investimento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={simulationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="month"
                          tick={{ fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            value % 12 === 0 ? `${value / 12} ano` : ""
                          }
                        />
                        <YAxis
                          tick={{ fill: "#6b7280" }}
                          tickFormatter={(value) =>
                            `R$ ${value.toLocaleString("pt-BR", { notation: "compact", compactDisplay: "short" })}`
                          }
                        />
                        <Tooltip
                          formatter={(value) => [
                            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            undefined,
                          ]}
                          labelFormatter={(label) => `Mês ${label}`}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalAmount"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6 }}
                          name="Valor Acumulado"
                        />
                        <Line
                          type="monotone"
                          dataKey="totalInvested"
                          stroke="#4ade80"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{ r: 6 }}
                          name="Valor Investido"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <div className="flex items-center gap-2">
                    <PieChartIcon className="h-6 w-6" />
                    <CardTitle>Composição do Patrimônio</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
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
                        <Tooltip
                          formatter={(value) => [
                            `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            undefined,
                          ]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden rounded-xl border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-6 w-6" />
                    <CardTitle>Detalhes Mensais</CardTitle>
                  </div>
                  <Button
                    onClick={handleExportToExcel}
                    className="flex items-center gap-2 border border-white/30 bg-transparent text-white hover:bg-white/10"
                  >
                    <Download size={16} />
                    Exportar Excel
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-y-auto rounded-b-xl">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="text-gray-700">Mês</TableHead>
                        <TableHead className="text-gray-700">
                          Valor Acumulado
                        </TableHead>
                        <TableHead className="text-gray-700">
                          Valor Investido
                        </TableHead>
                        <TableHead className="text-gray-700">
                          Juros Acumulados
                        </TableHead>
                        <TableHead className="text-gray-700">
                          Imposto de Renda
                        </TableHead>
                        <TableHead className="text-gray-700">
                          Valor Líquido
                        </TableHead>
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
                          <TableRow
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <TableCell className="font-medium">
                              {row.month}
                            </TableCell>
                            <TableCell className="text-blue-600">
                              R${" "}
                              {row.totalAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-green-600">
                              R${" "}
                              {row.totalInvested.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-purple-600">
                              R${" "}
                              {row.totalInterest.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="text-red-600">
                              R${" "}
                              {taxAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                            <TableCell className="font-semibold">
                              R${" "}
                              {netAmount.toLocaleString("pt-BR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 text-center text-xs italic text-gray-500">
                Valores projetados com base nos parâmetros informados.
                Rentabilidade passada não garante rentabilidade futura.
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default InvestmentSimulator;
