import Image from "next/image";

const About = () => {
  return (
    <div className="min-h-screen w-full bg-white text-gray-900">
      <section className="flex h-[500px] w-full flex-col items-center justify-center px-6 py-20 text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={120}
          height={120}
          className="mb-4"
        />
        <h1 className="text-4xl font-bold">Transforme sua Vida Financeira</h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          A <strong>Fivest</strong> é a plataforma ideal para você
          <strong> planejar, investir e crescer financeiramente</strong> com
          inteligência artificial e insights personalizados.
        </p>
      </section>

      <section className="w-full bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">
            Principais Funcionalidades
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="🔗 Open Finance Conectado"
              description="Sincronize suas contas bancárias e cartões automaticamente."
            />
            <FeatureCard
              title="📊 Monitoramento do Mercado"
              description="Acompanhe ações, criptomoedas e tendências econômicas em tempo real."
            />
            <FeatureCard
              title="🎯 IA Personalizada"
              description="Recomendações de investimentos com base no seu perfil e objetivos."
            />
            <FeatureCard
              title="💰 Gestão de Carteira"
              description="Gerencie seus ativos, acompanhe rentabilidade e aloque investimentos estrategicamente."
            />
            <FeatureCard
              title="📚 Fivest Learning"
              description="Aprenda sobre finanças e investimentos com conteúdos exclusivos."
            />
            <FeatureCard
              title="📈 Relatórios e Insights"
              description="Análises detalhadas para entender sua evolução financeira e tomar melhores decisões."
            />
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">
            Por que escolher a Finance App?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Nossa plataforma usa <strong>inteligência artificial</strong> e{" "}
            <strong>dados financeiros reais</strong> para oferecer{" "}
            <strong>insights personalizados</strong>, ajudando você a{" "}
            <strong>tomar decisões inteligentes</strong> e{" "}
            <strong>crescer financeiramente </strong>
            de forma segura.
          </p>
        </div>
      </section>

      <section className="w-full bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">
            Pronto para transformar suas finanças?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comece agora e tenha controle total sobre seu dinheiro!
          </p>
          <button className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-blue-700">
            Conhecer
          </button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

export default About;
