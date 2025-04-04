"use client";
import { useState } from "react";
import {
  Zap,
  Filter,
  Lightbulb,
  AlertTriangle,
  Calendar,
  PieChart,
  TrendingUp,
  Bookmark,
  Download,
  Target,
  CreditCard,
  DollarSign,
  BarChart2,
  Share2,
  Settings,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  Search,
  HelpCircle,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/_components/ui/card";

import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import { Separator } from "@/app/_components/ui/separator";

export default function InsightsIA() {
  const monthName = "Março";
  const [selectedPeriod, setSelectedPeriod] = useState("mensal");
  const [selectedCategory, setSelectedCategory] = useState("todas");

  const categories = [
    "Todas",
    "Alimentação",
    "Transporte",
    "Habitação",
    "Lazer",
    "Educação",
    "Saúde",
  ];

  const anomalies = [
    {
      category: "Alimentação",
      percentage: 32,
      difference: "R$ 480,00",
      suggestion: "Considere preparar mais refeições em casa.",
    },
    {
      category: "Transporte",
      percentage: 18,
      difference: "R$ 210,00",
      suggestion:
        "Explore opções de carona compartilhada ou transporte público.",
    },
  ];

  const savingsGoals = [
    {
      name: "Férias",
      progress: 65,
      target: "R$ 5.000,00",
      current: "R$ 3.250,00",
      date: "Dez/2025",
    },
    {
      name: "Emergência",
      progress: 80,
      target: "R$ 12.000,00",
      current: "R$ 9.600,00",
      date: "Ago/2025",
    },
    {
      name: "Novo Notebook",
      progress: 40,
      target: "R$ 6.000,00",
      current: "R$ 2.400,00",
      date: "Jan/2026",
    },
  ];

  const recentInsights = [
    {
      title: "Padrão de gastos em restaurantes",
      description:
        "Seus gastos em restaurantes são mais altos nas sextas-feiras, com média de R$ 120 por saída.",
      type: "pattern",
      date: "28/03/2025",
    },
    {
      title: "Economia potencial identificada",
      description:
        "Você poderia economizar até R$ 320 mensais cancelando serviços duplicados de streaming.",
      type: "saving",
      date: "25/03/2025",
    },
    {
      title: "Investimentos subutilizados",
      description:
        "Seu saldo em conta corrente está acima do necessário há 3 meses. Considere investir R$ 2.500 em renda fixa.",
      type: "investment",
      date: "22/03/2025",
    },
  ];

  const financialPulseScore = 82;
  const improvedCategories = ["Investimentos", "Poupança"];
  const needAttentionCategories = ["Gastos Variáveis", "Planejamento"];

  return (
    <div className="min-h-screen p-6">
      {/* Cabeçalho da Página */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <Zap className="h-8 w-8 text-blue-600" />
            Insights IA
          </h1>
          <p className="mt-1 text-gray-600">
            Análises inteligentes e recomendações personalizadas para suas
            finanças
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar insights..."
              className="w-64 rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {monthName} 2025
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros e controles */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Período
            </label>
            <div className="flex overflow-hidden rounded-md border">
              <button
                className={`px-4 py-1.5 text-sm ${selectedPeriod === "semanal" ? "bg-blue-50 font-medium text-blue-700" : "bg-white text-gray-600"}`}
                onClick={() => setSelectedPeriod("semanal")}
              >
                Semanal
              </button>
              <button
                className={`px-4 py-1.5 text-sm ${selectedPeriod === "mensal" ? "bg-blue-50 font-medium text-blue-700" : "bg-white text-gray-600"}`}
                onClick={() => setSelectedPeriod("mensal")}
              >
                Mensal
              </button>
              <button
                className={`px-4 py-1.5 text-sm ${selectedPeriod === "trimestral" ? "bg-blue-50 font-medium text-blue-700" : "bg-white text-gray-600"}`}
                onClick={() => setSelectedPeriod("trimestral")}
              >
                Trimestral
              </button>
              <button
                className={`px-4 py-1.5 text-sm ${selectedPeriod === "anual" ? "bg-blue-50 font-medium text-blue-700" : "bg-white text-gray-600"}`}
                onClick={() => setSelectedPeriod("anual")}
              >
                Anual
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Categorias
            </label>
            <select
              className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-500">
              Contas
            </label>
            <select className="rounded-md border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Todas as contas</option>
              <option>Conta Principal</option>
              <option>Conta Poupança</option>
              <option>Cartão de Crédito</option>
            </select>
          </div>
        </div>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros Avançados
        </Button>
      </div>

      {/* Tabs de Navegação de Insights */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4 grid grid-cols-5">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <PieChart className="mr-2 h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger
            value="anomalies"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Anomalias
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Tendências
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Target className="mr-2 h-4 w-4" />
            Metas
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Sugestões
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo da Tab Visão Geral */}
        <TabsContent value="overview" className="mt-0">
          <div className="mb-6 grid grid-cols-3 gap-6">
            {/* Card de Pontuação Financeira */}
            <Card className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <CardTitle className="text-lg font-bold">
                  Pulso Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke={
                          financialPulseScore > 70
                            ? "#22c55e"
                            : financialPulseScore > 40
                              ? "#f59e0b"
                              : "#ef4444"
                        }
                        strokeWidth="12"
                        strokeDasharray="440"
                        strokeDashoffset={
                          440 - (440 * financialPulseScore) / 100
                        }
                        transform="rotate(-90 80 80)"
                      />
                      <text
                        x="80"
                        y="85"
                        textAnchor="middle"
                        fontSize="36"
                        fontWeight="bold"
                        fill="#1e293b"
                      >
                        {financialPulseScore}
                      </text>
                      <text
                        x="80"
                        y="105"
                        textAnchor="middle"
                        fontSize="14"
                        fill="#64748b"
                      >
                        de 100
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">
                      Melhorou em
                    </h4>
                    <ul className="space-y-2">
                      {improvedCategories.map((category, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-500">
                      Precisa de atenção
                    </h4>
                    <ul className="space-y-2">
                      {needAttentionCategories.map((category, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>{category}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Resumo do Mês */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white">
                <CardTitle className="text-lg font-bold">
                  Resumo do Mês
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Receitas</p>
                      <p className="text-xl font-bold text-gray-800">
                        R$ 8.600,00
                      </p>
                      <span className="flex items-center text-xs text-green-600">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +5% vs. mês anterior
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Despesas</p>
                      <p className="text-xl font-bold text-gray-800">
                        R$ 5.600,00
                      </p>
                      <span className="flex items-center text-xs text-red-600">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        +8% vs. mês anterior
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-gray-500">Saldo</p>
                    <p className="text-2xl font-bold text-gray-800">
                      R$ 3.000,00
                    </p>
                    <span className="flex items-center text-xs text-amber-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      -2% vs. mês anterior
                    </span>
                  </div>

                  <div className="pt-2">
                    <p className="mb-1 text-sm font-medium text-gray-500">
                      Distribuição de Gastos
                    </p>
                    <div className="flex items-center">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        35% Essenciais
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-purple-600"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        45% Variáveis
                      </span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: "20%" }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        20% Investimentos
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Insights Recentes */}
            <Card className="border-none shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">
                <CardTitle className="text-lg font-bold">
                  Insights Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentInsights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {insight.type === "pattern" && (
                        <BarChart2 className="mt-0.5 h-5 w-5 text-blue-500" />
                      )}
                      {insight.type === "saving" && (
                        <DollarSign className="mt-0.5 h-5 w-5 text-green-500" />
                      )}
                      {insight.type === "investment" && (
                        <TrendingUp className="mt-0.5 h-5 w-5 text-purple-500" />
                      )}
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {insight.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {insight.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {insight.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  className="mt-4 w-full text-sm text-blue-600"
                >
                  Ver todos os insights
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Card de Anomalias Detectadas */}
          <Card className="mb-6 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-red-600 to-orange-600 p-4 text-white">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  Anomalias Detectadas
                </CardTitle>
                <p className="text-sm text-white/80">
                  Gastos incomuns identificados em {monthName}
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtrar por tipo
              </Button>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  {anomalies.map((anomaly, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border-l-4 border-red-500 bg-red-50 p-4"
                    >
                      <AlertTriangle className="mt-1 h-5 w-5 text-red-500" />
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {anomaly.category}:{" "}
                          <span className="text-red-600">
                            +{anomaly.percentage}%
                          </span>{" "}
                          acima da média
                        </h4>
                        <p className="mt-1 text-sm text-gray-600">
                          Você gastou{" "}
                          <span className="font-medium">
                            {anomaly.difference}
                          </span>{" "}
                          a mais que o normal.
                        </p>
                        <div className="mt-3 flex items-center">
                          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            Sugestão
                          </span>
                          <span className="ml-2 text-sm text-gray-600">
                            {anomaly.suggestion}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Ver transações
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-500"
                          >
                            Ignorar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-semibold text-gray-800">
                    Análise de Tendência
                  </h3>
                  <div className="flex h-56 items-center justify-center rounded-lg bg-gray-100">
                    {/* Gráfico simulado */}
                    <div className="flex h-full w-full flex-col p-4">
                      <div className="mb-2 text-xs text-gray-500">
                        Gastos em Alimentação - Últimos 6 meses
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute bottom-0 left-0 w-full border-t border-gray-300"></div>
                        <div className="absolute bottom-0 left-0 flex h-full w-full items-end">
                          <div className="w-1/6 px-1">
                            <div className="h-20 w-full rounded-t-sm bg-blue-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Out
                            </div>
                          </div>
                          <div className="w-1/6 px-1">
                            <div className="h-24 w-full rounded-t-sm bg-blue-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Nov
                            </div>
                          </div>
                          <div className="w-1/6 px-1">
                            <div className="h-28 w-full rounded-t-sm bg-blue-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Dez
                            </div>
                          </div>
                          <div className="w-1/6 px-1">
                            <div className="h-22 w-full rounded-t-sm bg-blue-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Jan
                            </div>
                          </div>
                          <div className="w-1/6 px-1">
                            <div className="h-26 w-full rounded-t-sm bg-blue-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Fev
                            </div>
                          </div>
                          <div className="w-1/6 px-1">
                            <div className="h-40 w-full rounded-t-sm bg-red-500"></div>
                            <div className="mt-1 text-center text-xs text-gray-500">
                              Mar
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      Transações que contribuíram:
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between text-sm text-gray-600">
                        <span>Restaurante Le Bistro</span>
                        <span className="font-medium">R$ 186,00</span>
                      </li>
                      <li className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fast Food (4x)</span>
                        <span className="font-medium">R$ 212,50</span>
                      </li>
                      <li className="flex justify-between text-sm text-gray-600">
                        <span>Supermercado Extra</span>
                        <span className="font-medium">R$ 420,00</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card de Oportunidades e Previsões */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            {/* Oportunidades de Economia */}
            <Card className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <DollarSign className="h-5 w-5" />
                  Oportunidades de Economia
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Assinaturas não utilizadas
                    </h3>
                    <p className="text-sm text-gray-600">
                      Detectamos 3 serviços de streaming que você não acessou
                      nos últimos 60 dias.
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Economia potencial:{" "}
                        <span className="text-green-600">R$ 75,00/mês</span>
                      </p>
                      <Button className="mt-2 bg-green-600 text-sm text-white hover:bg-green-700">
                        Ver detalhes
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Plano de internet
                    </h3>
                    <p className="text-sm text-gray-600">
                      Existe um plano mais econômico que atende ao seu consumo
                      mensal de dados.
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Economia potencial:{" "}
                        <span className="text-green-600">R$ 50,00/mês</span>
                      </p>
                      <Button className="mt-2 bg-green-600 text-sm text-white hover:bg-green-700">
                        Ver alternativas
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Plano de telefonia
                    </h3>
                    <p className="text-sm text-gray-600">
                      Seu uso de dados móveis está abaixo do contratado. Um
                      plano menor seria mais adequado.
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">
                        Economia potencial:{" "}
                        <span className="text-green-600">R$ 35,00/mês</span>
                      </p>
                      <Button className="mt-2 bg-green-600 text-sm text-white hover:bg-green-700">
                        Ver alternativas
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previsões para o próximo mês */}
            <Card className="overflow-hidden border-none shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <BarChart2 className="h-5 w-5" />
                  Previsões para o Próximo Mês
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Despesas previstas
                      </h3>
                      <p className="text-2xl font-bold text-gray-800">
                        R$ 5.600
                      </p>
                      <span className="text-xs text-gray-500">
                        Variação de ±5%
                      </span>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Saldo estimado
                      </h3>
                      <p className="text-2xl font-bold text-gray-800">
                        R$ 3.000
                      </p>
                      <span className="text-xs text-gray-500">
                        Baseado na média de receitas
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Categorias com possível aumento
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm text-gray-700">
                            Transporte
                          </span>
                        </div>
                        <span className="text-sm font-medium text-amber-600">
                          +12%
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm text-gray-700">Lazer</span>
                        </div>
                        <span className="text-sm font-medium text-amber-600">
                          +8%
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="text-sm text-gray-700">
                            Habitação
                          </span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          +2%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                    <h3 className="mb-2 font-semibold text-gray-800">
                      Eventos financeiros previstos
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Renovação do seguro auto</span>
                        </div>
                        <span className="font-medium">R$ 380,00</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Parcela do IPTU</span>
                        </div>
                        <span className="font-medium">R$ 220,00</span>
                      </li>
                      <li className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-blue-500" />
                          <span>Aniversário do(a) parceiro(a)</span>
                        </div>
                        <span className="font-medium">~R$ 250,00</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de Metas de Economia */}
          <Card className="mb-6 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Target className="h-5 w-5" />
                  Metas de Economia
                </CardTitle>
                <p className="text-sm text-white/80">
                  Acompanhe seu progresso em direção aos objetivos financeiros
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Target className="mr-2 h-4 w-4" />
                Nova Meta
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {savingsGoals.map((goal, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">
                        {goal.name}
                      </h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-1">
                        <Settings className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Meta:</span>
                        <span className="font-medium">{goal.target}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Atual:</span>
                        <span className="font-medium">{goal.current}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Data alvo:</span>
                        <span className="font-medium">{goal.date}</span>
                      </div>

                      <div>
                        <div className="mb-1 flex justify-between text-xs">
                          <span>{goal.progress}% concluído</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-purple-600"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button className="w-full bg-purple-600 text-sm text-white hover:bg-purple-700">
                        Depositar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card de Dicas Personalizadas */}
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-cyan-600 to-blue-600 p-4 text-white">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Lightbulb className="h-5 w-5" />
                  Dicas Personalizadas
                </CardTitle>
                <p className="text-sm text-white/80">
                  Recomendações baseadas no seu perfil financeiro
                </p>
              </div>
              <Button
                variant="secondary"
                className="bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Salvar Tudo
              </Button>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    Poupança Automática
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Configure transferências automáticas de 10% da sua renda
                    para uma conta poupança separada.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Bookmark className="mr-1 h-3 w-3" />
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500"
                    >
                      Ignorar
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    Diversificação de Investimentos
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Seu perfil indica que você poderia alocar 20% dos
                    investimentos em renda variável para maior retorno.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Bookmark className="mr-1 h-3 w-3" />
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500"
                    >
                      Ignorar
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <CreditCard className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-800">
                    Consolidação de Dívidas
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Unifique seus financiamentos em um empréstimo com taxa menor
                    para reduzir juros mensais.
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Bookmark className="mr-1 h-3 w-3" />
                      Salvar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-500"
                    >
                      Ignorar
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                className="mt-4 w-full text-sm text-blue-600"
              >
                Ver mais dicas personalizadas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo para outras abas seria adicionado aqui */}
        <TabsContent value="anomalies" className="mt-0">
          {/* Conteúdo da aba Anomalias */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Conteúdo detalhado de Anomalias virá aqui
            </h2>
            <p className="text-gray-600">
              Esta seção mostrará análises mais aprofundadas das anomalias de
              gastos.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="mt-0">
          {/* Conteúdo da aba Tendências */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Conteúdo detalhado de Tendências virá aqui
            </h2>
            <p className="text-gray-600">
              Esta seção mostrará análises de tendências de gastos e receitas ao
              longo do tempo.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="mt-0">
          {/* Conteúdo da aba Metas */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Conteúdo detalhado de Metas virá aqui
            </h2>
            <p className="text-gray-600">
              Esta seção mostrará análises e acompanhamento detalhado das suas
              metas financeiras.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-0">
          {/* Conteúdo da aba Sugestões */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Conteúdo detalhado de Sugestões virá aqui
            </h2>
            <p className="text-gray-600">
              Esta seção mostrará sugestões personalizadas para melhorar sua
              saúde financeira.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rodapé da Página */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
            <Download className="h-4 w-4" />
            Exportar dados
          </button>
          <Separator orientation="vertical" className="h-4" />
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
            <Share2 className="h-4 w-4" />
            Compartilhar
          </button>
          <Separator orientation="vertical" className="h-4" />
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
            <HelpCircle className="h-4 w-4" />
            Ajuda
          </button>
        </div>

        <div className="text-xs text-gray-500">
          Última atualização: 02/04/2025 às 10:30 • Dados processados pela IA
        </div>
      </div>
    </div>
  );
}
