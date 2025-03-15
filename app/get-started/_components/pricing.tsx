import { Check, MoveRight, PhoneCall } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";

export const Pricing = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <Badge>Assinaturas</Badge>
        <div className="flex flex-col gap-2">
          <h2 className="font-regular max-w-xl text-center text-3xl tracking-tighter md:text-5xl">
            Preços que fazem sentido
          </h2>
          <p className="max-w-xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground">
            Aproveite ao máximo a plataforma com nossos planos!
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 pt-20 text-left lg:grid-cols-3">
          <Card className="w-full rounded-md">
            <CardHeader>
              <CardTitle>
                <span className="flex flex-row items-center gap-4 font-normal">
                  Básico
                </span>
              </CardTitle>
              <CardDescription>
                Ideal para quem está começando a organizar suas finanças e
                investimentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-start gap-8">
                <p className="flex flex-row items-center gap-2 text-xl">
                  <span className="text-4xl">R$29</span>
                  <span className="text-sm text-muted-foreground"> / mês</span>
                </p>
                <div className="flex flex-col justify-start gap-4">
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Gestão de transações</p>
                      <p className="text-sm text-muted-foreground">
                        Registre e categorize suas transações facilmente.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Relatórios mensais</p>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe seus gastos e receitas com gráficos simples.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Suporte por e-mail</p>
                      <p className="text-sm text-muted-foreground">
                        Respostas rápidas para suas dúvidas.
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="gap-4">
                  Assinar agora <MoveRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full rounded-md shadow-2xl">
            <CardHeader>
              <CardTitle>
                <span className="flex flex-row items-center gap-4 font-normal">
                  Intermediário (Recomendado)
                </span>
              </CardTitle>
              <CardDescription>
                Para quem deseja mais controle e insights sobre suas finanças e
                investimentos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-start gap-8">
                <p className="flex flex-row items-center gap-2 text-xl">
                  <span className="text-4xl">R$59</span>
                  <span className="text-sm text-muted-foreground"> / mês</span>
                </p>
                <div className="flex flex-col justify-start gap-4">
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Análise de investimentos</p>
                      <p className="text-sm text-muted-foreground">
                        Acompanhe o desempenho da sua carteira de investimentos.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Metas financeiras</p>
                      <p className="text-sm text-muted-foreground">
                        Defina e acompanhe suas metas de economia e
                        investimento.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Suporte prioritário</p>
                      <p className="text-sm text-muted-foreground">
                        Atendimento rápido por e-mail e chat.
                      </p>
                    </div>
                  </div>
                </div>
                <Button className="gap-4">
                  Assinar agora <MoveRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full rounded-md">
            <CardHeader>
              <CardTitle>
                <span className="flex flex-row items-center gap-4 font-normal">
                  Avançado
                </span>
              </CardTitle>
              <CardDescription>
                Para usuários que buscam o máximo de controle e personalização.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col justify-start gap-8">
                <p className="flex flex-row items-center gap-2 text-xl">
                  <span className="text-4xl">R$99</span>
                  <span className="text-sm text-muted-foreground"> / mês</span>
                </p>
                <div className="flex flex-col justify-start gap-4">
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Relatórios personalizados</p>
                      <p className="text-sm text-muted-foreground">
                        Crie relatórios detalhados e personalizados.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Integração com corretoras</p>
                      <p className="text-sm text-muted-foreground">
                        Conecte-se diretamente com suas corretoras de
                        investimento.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4">
                    <Check className="mt-2 h-4 w-4 text-primary" />
                    <div className="flex flex-col">
                      <p>Suporte premium</p>
                      <p className="text-sm text-muted-foreground">
                        Atendimento dedicado e consultoria personalizada.
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="gap-4">
                  Agendar reunião <PhoneCall className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
);
