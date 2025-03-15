import { Badge } from "@/app/_components/ui/badge";

export const Feature = () => (
  <div className="w-full py-20 lg:py-40" id="features">
    <div className="container mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-start gap-4">
          <div>
            <Badge>Platforma</Badge>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
              Funcionalidades!
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground">
              A plataforma utiliza Inteligência Artificial (IA) para analisar os
              extratos bancários e transações dos usuários, identificar
              oportunidades de economia e sugerir investimentos personalizados
              com base no perfil financeiro, objetivos e aporte disponível.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">
              🔗 Open Finance Conectado
            </h3>
            <p className="text-base text-muted-foreground">
              Sincronize suas contas bancárias e cartões automaticamente.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">
              📊 Monitoramento do Mercado
            </h3>
            <p className="text-base text-muted-foreground">
              Acompanhe ações, criptomoedas e tendências econômicas em tempo
              real.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">🎯 IA Personalizada</h3>
            <p className="text-base text-muted-foreground">
              Recomendações de investimentos com base no seu perfil e objetivos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">💰 Gestão de Carteira</h3>
            <p className="text-base text-muted-foreground">
              Gerencie seus ativos, acompanhe rentabilidade e aloque
              investimentos estrategicamente.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">📚 Fivest Learning</h3>
            <p className="text-base text-muted-foreground">
              Aprenda sobre finanças e investimentos com conteúdos exclusivos.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="mb-2 aspect-video rounded-md bg-muted"></div>
            <h3 className="text-xl tracking-tight">📈 Relatórios e Insights</h3>
            <p className="text-base text-muted-foreground">
              Análises detalhadas para entender sua evolução financeira e tomar
              melhores decisões.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
