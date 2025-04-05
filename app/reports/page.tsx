import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isMatch } from "date-fns";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  ChartBar,
  AlertTriangle,
  BarChart4,
  LineChart,
  Download,
  Share2,
  Lightbulb,
  MoreHorizontal,
  FileText,
  Zap,
  Menu,
} from "lucide-react";
import { Button } from "../_components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../_components/ui/card";
import TimeSelect from "../(home)/_components/time-select";
import { AmountVisibilityProvider } from "../_contexts/amount-visibility-context";

interface AnalysisAndReportsProps {
  searchParams: {
    month: string;
  };
}

const AnalysisAndReports = async ({
  searchParams: { month },
}: AnalysisAndReportsProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/get-started");
  }

  const monthIsInvalid = !month || !isMatch(month, "MM");

  if (monthIsInvalid) {
    redirect(`?month=${new Date().getMonth() + 1}`);
  }

  // const dashboard = await getDashboard(month);

  // Dados fictícios para análises e insights
  const monthName = new Date(2025, parseInt(month) - 1, 1).toLocaleString(
    "pt-BR",
    { month: "long" },
  );
  const anomalies = [
    {
      category: "Alimentação",
      percentage: 43,
      difference: "R$ 320,45",
      suggestion: "Considere reduzir despesas com delivery",
    },
    {
      category: "Transporte",
      percentage: 28,
      difference: "R$ 180,70",
      suggestion: "Opte por meios de transporte mais econômicos",
    },
  ];

  return (
    <AmountVisibilityProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Cabeçalho com gradiente */}
        <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PieChart className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Análises e Relatórios</h1>
                <p className="text-white/80">
                  Insights inteligentes sobre suas finanças
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
              <Button
                variant="secondary"
                className="bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Compartilhar
              </Button>
              <TimeSelect />
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md">
              <CardHeader className="bg-blue-50 p-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-blue-700">
                  <TrendingUp className="h-5 w-5" />
                  Receitas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-blue-600">R$ 8.530,00</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600">+12%</span>
                  <span className="ml-2 text-gray-500">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md">
              <CardHeader className="bg-red-50 p-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-red-700">
                  <TrendingDown className="h-5 w-5" />
                  Despesas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-red-600">R$ 5.730,00</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-600">+8%</span>
                  <span className="ml-2 text-gray-500">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md">
              <CardHeader className="bg-green-50 p-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-green-700">
                  <BarChart4 className="h-5 w-5" />
                  Economia
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-green-600">R$ 2.800,00</p>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                  <span className="font-medium text-green-600">+23%</span>
                  <span className="ml-2 text-gray-500">vs. mês anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md">
              <CardHeader className="bg-purple-50 p-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-purple-700">
                  <LineChart className="h-5 w-5" />
                  Tendência
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-bold text-purple-600">Positiva</p>
                <div className="mt-2 flex items-center text-sm">
                  <span className="text-gray-600">Crescimento sustentável</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Insights */}
          <div className="grid grid-cols-[2fr,1fr] gap-6">
            {/* Coluna Esquerda - Análises Detalhadas */}
            <div className="space-y-6">
              {/* Card de Insights Principais */}
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <Zap className="h-6 w-6" />
                      Insights IA
                    </CardTitle>
                    <p className="text-sm">Análise de {monthName}</p>
                  </div>
                  <Button variant="secondary">
                    <Menu className="mr-2 h-4 w-4" />
                    Ver mais
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  <div className="flex items-center gap-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                    <Lightbulb className="h-10 w-10 text-blue-500" />
                    <div>
                      <h3 className="font-bold text-gray-800">Resumo Mensal</h3>
                      <p className="text-gray-600">
                        Seu balanço financeiro em {monthName} está{" "}
                        <span className="font-medium text-green-600">
                          15% melhor
                        </span>{" "}
                        que no mês anterior. Continue mantendo suas despesas com
                        Alimentação sob controle.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">
                      Anomalias Detectadas
                    </h3>
                    <div className="space-y-3">
                      {anomalies.map((anomaly, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 rounded-lg bg-red-50 p-4"
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
                            <p className="text-sm text-gray-600">
                              Você gastou{" "}
                              <span className="font-medium">
                                {anomaly.difference}
                              </span>{" "}
                              a mais que o normal.
                            </p>
                            <div className="mt-2 flex items-center">
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                Sugestão
                              </span>
                              <span className="ml-2 text-sm text-gray-600">
                                {anomaly.suggestion}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-green-50 p-4">
                      <h3 className="mb-2 font-semibold text-gray-800">
                        Oportunidades de Economia
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600">
                            Renegociar plano de internet: até R$ 50/mês
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600">
                            Revisar assinaturas não utilizadas: R$ 75/mês
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm text-gray-600">
                            Comparar planos de telefonia: até R$ 35/mês
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-50 p-4">
                      <h3 className="mb-2 font-semibold text-gray-800">
                        Previsões para o Próximo Mês
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-gray-600">
                            Despesas previstas: R$ 5.600 (±5%)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-gray-600">
                            Saldo positivo estimado: R$ 3.000
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm text-gray-600">
                            Possível aumento em Transporte: +12%
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-gray-50 p-4">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-xs italic text-gray-500">
                      Gerado por IA em 29/03/2025 • Dados com base nas suas
                      transações
                    </p>
                    <Button variant="outline" size="sm" className="text-xs">
                      <FileText className="mr-1 h-3 w-3" />
                      Relatório Completo
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Card de Análise de Gastos por Categoria */}
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between p-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <ChartBar className="h-6 w-6" />
                      Análise de Gastos por Categoria
                    </CardTitle>
                    <p className="text-sm">Comparativo dos últimos 3 meses</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-white/20 text-white transition-colors hover:bg-white/30"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    Opções
                  </Button>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Tabela de Categorias */}
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Categoria
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                              Jan
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                              Fev
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                              Mar
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                              Tendência
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                Alimentação
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 950,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 1.150,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 1.350,00
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingUp className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-600">
                                  +42%
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t border-gray-200 bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-blue-500" />
                                Transporte
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 750,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 800,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 830,00
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingUp className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-600">
                                  +10%
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-purple-500" />
                                Lazer
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 550,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 450,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 380,00
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingDown className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">
                                  -31%
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t border-gray-200 bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-green-500" />
                                Saúde
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 320,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 350,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 330,00
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingDown className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">
                                  +3%
                                </span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                                Assinaturas
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 280,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 280,00
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-gray-700">
                              R$ 350,00
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <TrendingUp className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-red-600">
                                  +25%
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Insights de Categorias */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                        <h3 className="mb-2 font-semibold text-gray-800">
                          Categorias em Alta
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">
                            Alimentação (+42%)
                          </span>{" "}
                          e{" "}
                          <span className="font-medium">
                            Assinaturas (+25%)
                          </span>{" "}
                          são as categorias com maior crescimento. Considere
                          revisar seus gastos nessas áreas.
                        </p>
                      </div>

                      <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                        <h3 className="mb-2 font-semibold text-gray-800">
                          Categorias em Queda
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Lazer (-31%)</span> teve
                          significativa redução. Continue mantendo este
                          comportamento para equilibrar suas finanças.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Direita - Cards Menores */}
            <div className="space-y-6">
              {/* Card de Pontuação Financeira */}
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <ChartBar className="h-6 w-6" />
                    Pontuação Financeira
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 flex h-36 w-36 items-center justify-center rounded-full border-8 border-green-100">
                    <span className="text-4xl font-bold text-green-600">
                      72
                    </span>
                  </div>

                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">Boa</h3>
                    <p className="text-sm text-gray-600">
                      Sua pontuação melhorou 5 pontos
                    </p>
                  </div>

                  <div className="mb-4 h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2.5 rounded-full bg-green-600"
                      style={{ width: "72%" }}
                    ></div>
                  </div>

                  <div className="flex w-full justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col border-t bg-gray-50 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">
                    Como melhorar:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Reduza gastos com Alimentação
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Aumente sua reserva de emergência
                    </li>
                  </ul>
                </CardFooter>
              </Card>

              {/* Card de Previsão de Gastos */}
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Calendar className="h-6 w-6" />
                    Próximos Pagamentos
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-purple-100 p-2">
                          <CreditCard className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Netflix</p>
                          <p className="text-xs text-gray-500">02/04/2025</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700">
                        R$ 39,90
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Internet</p>
                          <p className="text-xs text-gray-500">05/04/2025</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700">
                        R$ 149,90
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-100 p-2">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Academia</p>
                          <p className="text-xs text-gray-500">10/04/2025</p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700">
                        R$ 99,90
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t bg-gray-50 p-4">
                  <Button variant="outline" className="w-full rounded-full">
                    Ver todos os pagamentos
                  </Button>
                </CardFooter>
              </Card>

              {/* Card de Dicas */}
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Lightbulb className="h-6 w-6" />
                    Dicas Personalizadas
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3">
                      <h3 className="font-semibold text-gray-800">
                        Considere um cartão com cashback
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Com seus gastos mensais, você poderia economizar até R$
                        85/mês com um cartão que ofereça 1.5% de cashback.
                      </p>
                    </div>

                    <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
                      <h3 className="font-semibold text-gray-800">
                        Reduza seus gastos com alimentação
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Experimente planejar suas refeições semanalmente e fazer
                        compras com uma lista preparada para evitar gastos por
                        impulso.
                      </p>
                    </div>

                    <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-3">
                      <h3 className="font-semibold text-gray-800">
                        Aumente sua reserva de emergência
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Considere automatizar um depósito mensal de R$ 300 em
                        uma conta separada para sua reserva de emergência.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Seção de Relatórios */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Relatórios Disponíveis
              </h2>
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Criar Relatório Personalizado
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Relatório Mensal Detalhado
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <p className="text-sm text-gray-600">
                    Análise completa de receitas e despesas com gráficos e
                    comparativos.
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-green-600" />
                    Evolução de Patrimônio
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <p className="text-sm text-gray-600">
                    Visão histórica do seu patrimônio líquido e investimentos ao
                    longo do tempo.
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md transition-shadow hover:shadow-lg">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Projeção Financeira
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-2">
                  <p className="text-sm text-gray-600">
                    Estimativas de receitas, despesas e patrimônio para os
                    próximos 12 meses.
                  </p>
                </CardContent>
                <CardFooter className="p-4">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Baixar PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AmountVisibilityProvider>
  );
};

export default AnalysisAndReports;
