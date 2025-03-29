import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../_components/ui/card";
import {
  CheckIcon,
  XIcon,
  Star,
  CreditCard,
  Zap,
  AlertTriangle,
} from "lucide-react";
import AcquirePlanButton from "./_components/acquire-plan-button";
import { Badge } from "../_components/ui/badge";
import getCurrentMonthTrasactions from "../_data/get-current-month-transactions";
import { Progress } from "../_components/ui/progress";

const SubscriptionPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/get-started");
  }

  const user = await clerkClient().users.getUser(userId);
  const { currentMonthTransactions } = await getCurrentMonthTrasactions();
  const hasPremiumPlan = user.publicMetadata.subscriptionPlan === "premium";

  // Cálculo da porcentagem de uso para o plano básico
  const usagePercentage = Math.min((currentMonthTransactions / 10) * 100, 100);
  const isLimitReached = currentMonthTransactions >= 10;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            Planos de Assinatura
          </h1>
          <p className="text-gray-600">
            Escolha o plano ideal para suas necessidades financeiras
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Plano Básico */}
          <Card className="relative overflow-hidden rounded-xl border-none bg-white shadow-md transition-all hover:shadow-lg">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-200 to-gray-300"></div>
            <CardHeader className="border-b border-gray-100 pb-6 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Plano Básico
                </h2>
                {!hasPremiumPlan && (
                  <Badge className="bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Atual
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                <span className="ml-1 text-lg text-gray-500">/ mês</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Ideal para começar a controlar suas finanças
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">
                    Dashboard de controle financeiro
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">Categorias de gastos básicas</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <XIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-500">Relatórios de IA</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <XIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-500">Suporte prioritário</p>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Transações mensais:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {currentMonthTransactions}/10
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2" />

                {isLimitReached && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-700">
                    <AlertTriangle className="h-3 w-3" />
                    Você atingiu o limite de transações deste mês
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plano Premium */}
          <Card className="relative overflow-hidden rounded-xl border-none bg-white shadow-lg transition-all hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            {hasPremiumPlan && (
              <div className="absolute -right-12 top-7 z-10 rotate-45 bg-gradient-to-r from-green-500 to-emerald-600 px-12 py-1 text-xs font-bold text-white shadow-md">
                ATIVO
              </div>
            )}
            <CardHeader className="border-b border-gray-100 pb-6 pt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Plano Premium
                  </h2>
                </div>
                {!hasPremiumPlan && (
                  <Badge className="bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                    Recomendado
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">
                  R$ 19,90
                </span>
                <span className="ml-1 text-lg text-gray-500">/ mês</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Controle completo das suas finanças com recursos exclusivos
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">
                    Dashboard avançado de controle financeiro
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Transações ilimitadas
                    </p>
                    <p className="text-xs text-gray-500">
                      Gerencie todas suas transações sem limites
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Relatórios de IA personalizados
                    </p>
                    <p className="text-xs text-gray-500">
                      Insights inteligentes sobre seus gastos
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <CheckIcon className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">Suporte prioritário 24/7</p>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Recursos premium desbloqueados
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 p-6">
              <AcquirePlanButton />
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
          <p className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4" />
            Processamento seguro de pagamentos via Stripe. Cancele quando
            quiser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
