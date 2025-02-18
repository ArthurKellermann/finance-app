"use client";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import { useResizeDetector } from "react-resize-detector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useState } from "react";

interface CreditCardBarChartProps {
  chartData: any[];
  uniqueCards: any[];
}

const colors = [
  "#4A90E2", // Vibrant blue
  "#F5A623", // Soft orange
  "#50E3C2", // Aqua green
  "#7ED321", // Lime green
  "#B0BEC5", // Light gray
  "#90A4AE", // Bluish gray
  "#FFFFFF", // White
  "#FFB6C1", // Light pink
  "#ADD8E6", // Light blue
  "#DDA0DD", // Light purple
  "#FFE4B5", // Light yellow
  "#FFD700", // Gold
  "#20B2AA", // Sea green
];

// Componente personalizado para o Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Formata a data para DD/MM/AAAA
    const formattedDate = new Date(label).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (
      <div className="rounded-md border border-border bg-background p-3 shadow-sm">
        <p className="font-semibold">{formattedDate}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {entry.value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const CreditCardSpendingBarChart = ({
  chartData,
  uniqueCards,
}: CreditCardBarChartProps) => {
  const { width, ref } = useResizeDetector();
  const [selectedCard, setSelectedCard] = useState<string>("all");

  const filteredData =
    selectedCard === "all"
      ? chartData
      : chartData.map((entry) => ({
          date: entry.date,
          [selectedCard]: entry[selectedCard],
        }));

  return (
    <div className="h-full space-y-6 rounded-md bg-card p-4" ref={ref}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Gastos Diários por Cartão (Últimos 30 Dias)
        </h2>
        <Select onValueChange={(value) => setSelectedCard(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione um cartão" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cartões</SelectItem>
            {uniqueCards.map((card, index) => (
              <SelectItem key={index} value={card}>
                {card}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="h-[400px] w-full">
        <BarChart
          width={width || 800}
          height={400}
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => new Date(value).getDate().toString()}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} /> <Legend />
          {selectedCard === "all" ? (
            uniqueCards.map((card, index) => (
              <Bar
                key={index}
                dataKey={card}
                fill={colors[index % colors.length]}
                radius={4}
              />
            ))
          ) : (
            <Bar
              dataKey={selectedCard}
              fill={colors[uniqueCards.indexOf(selectedCard) % colors.length]}
              radius={4}
            />
          )}
        </BarChart>
      </div>
    </div>
  );
};

export default CreditCardSpendingBarChart;
