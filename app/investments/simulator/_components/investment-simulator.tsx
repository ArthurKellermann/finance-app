"use client";
import { useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
} from "recharts";

const InvestmentSimulator = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(0);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(0);
  const [investmentDuration, setInvestmentDuration] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [simulationData, setSimulationData] = useState<any[]>([]);

  const handleSimulation = () => {
    // Lógica de simulação de investimento
    const data = [];
    let totalAmount = initialInvestment;
    for (let month = 1; month <= investmentDuration; month++) {
      totalAmount += monthlyContribution;
      totalAmount *= 1 + interestRate / 100 / 12;
      data.push({ month, totalAmount });
    }
    setSimulationData(data);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Investimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label
                htmlFor="initialInvestment"
                className="text-sm font-medium text-gray-700"
              >
                Investimento Inicial
              </label>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="monthlyContribution"
                className="text-sm font-medium text-gray-700"
              >
                Contribuição Mensal
              </label>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="investmentDuration"
                className="text-sm font-medium text-gray-700"
              >
                Duração (meses)
              </label>
              <Input
                id="investmentDuration"
                type="number"
                value={investmentDuration}
                onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="interestRate"
                className="text-sm font-medium text-gray-700"
              >
                Taxa de Juros Anual (%)
              </label>
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={handleSimulation} className="mt-4">
            Simular
          </Button>
        </CardContent>
      </Card>

      {simulationData.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados da Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Investimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead>Valor Acumulado</TableHead>
                      <TableHead>Contribuição Mensal</TableHead>
                      <TableHead>Juros Acumulados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulationData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell>{row.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{monthlyContribution.toFixed(2)}</TableCell>
                        <TableCell>
                          {(
                            row.totalAmount -
                            initialInvestment -
                            monthlyContribution * row.month
                          ).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
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
