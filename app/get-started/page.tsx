"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  ChartBar,
  BarChart4,
  LineChart,
  Download,
  Share2,
  Lightbulb,
  Filter,
  CheckCircle,
  Shield,
  Zap,
  Menu,
  X,
  MoveRight,
  ArrowDown,
  Star,
  LayoutDashboard,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

const GetStarted = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const titles = ["economizar", "investir", "gerenciar", "cuidar", "evoluir"];

  const testimonials = [
    {
      name: "Mariana Silva",
      role: "Designer",
      content:
        "Nunca imaginei que gerenciar minhas finanças pudesse ser tão intuitivo. Os insights de IA me ajudaram a economizar mais de R$500 por mês!",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Rafael Costa",
      role: "Engenheiro",
      content:
        "Com a plataforma, consegui visualizar onde estava gastando demais e criei uma estratégia para começar a investir. Em 6 meses, já tenho uma reserva de emergência completa.",
      avatar: "/api/placeholder/40/40",
    },
    {
      name: "Juliana Mendes",
      role: "Empreendedora",
      content:
        "As análises e relatórios me deram uma visão clara das minhas finanças pessoais e do meu pequeno negócio. Recomendo para todos os empreendedores.",
      avatar: "/api/placeholder/40/40",
    },
  ];

  const features = [
    {
      title: "Dashboard Intuitivo",
      description:
        "Visualize todas as suas finanças em um só lugar, com gráficos e indicadores personalizados.",
      icon: <LayoutDashboard className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Insights de IA",
      description:
        "Receba recomendações personalizadas baseadas no seu perfil financeiro e comportamento de gastos.",
      icon: <Zap className="h-10 w-10 text-purple-500" />,
    },
    {
      title: "Análise de Despesas",
      description:
        "Entenda para onde vai seu dinheiro com categorização automática e detecção de anomalias.",
      icon: <ChartBar className="h-10 w-10 text-red-500" />,
    },
    {
      title: "Planejamento de Metas",
      description:
        "Defina objetivos financeiros e acompanhe seu progresso com planos personalizados.",
      icon: <TrendingUp className="h-10 w-10 text-green-500" />,
    },
    {
      title: "Segurança Avançada",
      description:
        "Seus dados financeiros protegidos com criptografia de ponta e autenticação em dois fatores.",
      icon: <Shield className="h-10 w-10 text-yellow-500" />,
    },
    {
      title: "Relatórios Detalhados",
      description:
        "Exporte e compartilhe relatórios personalizados para melhor controle financeiro.",
      icon: <PieChart className="h-10 w-10 text-blue-500" />,
    },
  ];

  const pricingPlans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre",
      description: "Para quem está começando a organizar suas finanças",
      features: [
        "Dashboard básico",
        "Categorização de despesas",
        "Limite de 2 contas bancárias",
        "Relatórios mensais",
      ],
      cta: "Começar agora",
      popular: false,
    },
    {
      name: "Premium",
      price: "R$ 24,90",
      period: "por mês",
      description: "Para quem quer controle financeiro completo",
      features: [
        "Dashboard avançado",
        "Insights de IA",
        "Contas bancárias ilimitadas",
        "Detecção de anomalias",
        "Previsões financeiras",
        "Suporte prioritário",
      ],
      cta: "Assinar agora",
      popular: true,
    },
    {
      name: "Família",
      price: "R$ 39,90",
      period: "por mês",
      description: "Para gerenciar finanças de toda a família",
      features: [
        "Todos os recursos do Premium",
        "Até 5 usuários",
        "Objetivos compartilhados",
        "Controle de mesada",
        "Educação financeira para crianças",
        "Suporte 24/7",
      ],
      cta: "Obter plano família",
      popular: false,
    },
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [titleNumber, titles.length]);

  const navigationItems = [
    {
      title: "Início",
      href: "#",
    },
    {
      title: "Recursos",
      href: "#features",
    },
    {
      title: "Planos",
      href: "#pricing",
    },
    {
      title: "Depoimentos",
      href: "#testimonials",
    },
    {
      title: "FAQ",
      href: "#faq",
    },
  ];

  const faqItems = [
    {
      question: "Como a plataforma protege meus dados financeiros?",
      answer:
        "Utilizamos criptografia de ponta a ponta e seguimos os mais rigorosos protocolos de segurança bancária. Seus dados são armazenados em servidores seguros e nunca compartilhados com terceiros sem sua autorização explícita.",
    },
    {
      question: "É possível conectar minhas contas bancárias automaticamente?",
      answer:
        "Sim! Nossa plataforma oferece integração segura com mais de 250 instituições financeiras no Brasil, permitindo que você sincronize automaticamente seus dados bancários para um controle financeiro mais eficiente.",
    },
    {
      question: "Como funciona a análise de IA para meus gastos?",
      answer:
        "Nossa inteligência artificial analisa seus padrões de gastos ao longo do tempo, identifica anomalias, detecta oportunidades de economia e oferece insights personalizados com base no seu comportamento financeiro e objetivos estabelecidos.",
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer:
        "Absolutamente! Não há contratos de fidelidade. Você pode cancelar sua assinatura a qualquer momento diretamente na plataforma, sem taxas ou burocracia.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header
        className={`fixed z-50 w-full transition-all duration-300 ${scrolled ? "bg-white py-3 shadow-md" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-blue-600">Fivest</div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="font-medium text-gray-700 transition-colors hover:text-blue-600"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <button className="px-4 py-2 font-medium text-gray-700 transition-colors hover:text-blue-600">
              Entrar
            </button>
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
              Começar grátis
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!isOpen)}
              className="p-2 text-gray-700"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="border-t bg-white py-4 shadow-lg md:hidden">
            <div className="container mx-auto space-y-3 px-4">
              {navigationItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </a>
              ))}
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
                <button className="w-full py-2 font-medium text-gray-700">
                  Entrar
                </button>
                <button className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white">
                  Começar grátis
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 pb-20 pt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              <span className="text-gray-800">Aqui você pode</span>
              <div className="relative mt-2 inline-block h-16 w-full overflow-hidden md:h-20">
                {titles.map((title, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transform transition-all duration-500 ${
                      titleNumber === index
                        ? "translate-y-0 opacity-100"
                        : titleNumber > index
                          ? "-translate-y-full opacity-0"
                          : "translate-y-full opacity-0"
                    }`}
                  >
                    <span className="font-bold text-blue-600">{title}</span>
                  </div>
                ))}
              </div>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
              Transforme sua relação com o dinheiro através de uma plataforma
              completa de gerenciamento financeiro com insights de IA para
              decisões mais inteligentes.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#features"
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Conhecer recursos
                <ArrowDown className="h-4 w-4" />
              </a>
              <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                Começar gratuitamente
                <MoveRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PieChart className="h-6 w-6" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        Dashboard Financeiro
                      </h3>
                      <p className="text-sm text-white/80">
                        Visualize suas finanças em tempo real
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30">
                      <Filter className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Receitas</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      R$ 8.530,00
                    </p>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      <span className="font-medium text-green-600">+12%</span>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <h3 className="font-semibold">Despesas</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      R$ 5.730,00
                    </p>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                      <span className="font-medium text-red-600">+8%</span>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-green-500 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <BarChart4 className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold">Economia</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      R$ 2.800,00
                    </p>
                    <div className="mt-2 flex items-center text-sm">
                      <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                      <span className="font-medium text-green-600">+23%</span>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-purple-500 bg-purple-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <LineChart className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold">Tendência</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      Positiva
                    </p>
                    <div className="mt-2 flex items-center text-sm">
                      <span className="text-gray-600">Sustentável</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
                  <Lightbulb className="mt-1 h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="mb-1 font-semibold text-gray-800">
                      Insight IA
                    </h3>
                    <p className="text-gray-700">
                      Seus gastos com alimentação aumentaram 43% este mês.
                      Considere reduzir pedidos de delivery para economizar
                      aproximadamente R$ 320.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Recursos Poderosos para Suas Finanças
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Descubra como nossa plataforma pode transformar sua gestão
              financeira com ferramentas intuitivas e análises inteligentes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
            <div>
              <p className="mb-2 text-4xl font-bold md:text-5xl">78%</p>
              <p className="text-lg opacity-85">
                dos usuários economizam mais após 3 meses
              </p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold md:text-5xl">2.5x</p>
              <p className="text-lg opacity-85">
                aumento na taxa de investimento pessoal
              </p>
            </div>
            <div>
              <p className="mb-2 text-4xl font-bold md:text-5xl">50.000+</p>
              <p className="text-lg opacity-85">
                clientes satisfeitos em todo o Brasil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Como Funciona
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Em apenas três passos simples, você transforma sua gestão
              financeira para sempre.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold">Conecte suas contas</h3>
              <p className="text-gray-600">
                Sincronize suas contas bancárias e cartões de crédito de forma
                segura e automática.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold">Visualize seus gastos</h3>
              <p className="text-gray-600">
                Veja suas finanças organizadas em categorias e gráficos
                intuitivos com atualizações em tempo real.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold">
                Receba insights personalizados
              </h3>
              <p className="text-gray-600">
                Nossa IA analisa seus dados e oferece recomendações para
                economizar e investir melhor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              O Que Nossos Clientes Dizem
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Mais de 50.000 pessoas já transformaram suas finanças com nossa
              plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-lg"
              >
                <div className="mb-4 flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="mb-6 italic text-gray-700">
                  {testimonial.content}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Planos Simples e Transparentes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Escolha o plano ideal para suas necessidades financeiras. Sem
              taxas ocultas.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-xl bg-white shadow-lg ${plan.popular ? "relative border-2 border-blue-600" : "border border-gray-100"}`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 py-1 text-center text-sm font-medium text-white">
                    Mais popular
                  </div>
                )}

                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600"> {plan.period}</span>
                  </div>
                  <p className="mb-6 text-gray-600">{plan.description}</p>

                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full rounded-lg py-3 font-medium transition-colors ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Perguntas Frequentes
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Tire suas dúvidas sobre nossa plataforma financeira.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="rounded-xl bg-white p-6 shadow-md">
                  <h3 className="mb-3 text-lg font-bold">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Pronto para transformar suas finanças?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Junte-se a milhares de brasileiros que já estão economizando mais e
            investindo melhor.
          </p>
          <div className="mx-auto flex max-w-md flex-col justify-center gap-4 sm:flex-row">
            <button className="flex-1 rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100">
              Começar gratuitamente
            </button>
            <button className="flex-1 rounded-lg border border-white bg-transparent px-6 py-3 font-medium text-white transition-colors hover:bg-white/10">
              Falar com consultor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 pb-8 pt-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold">Fivest</h3>
              <p className="mb-4 text-gray-400">
                Simplificando o gerenciamento financeiro para brasileiros com
                tecnologia de ponta e insights inteligentes.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Plataforma</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Análises
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Investimentos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Relatórios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Planejamento
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Empresa</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Carreiras
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Imprensa
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Parcerias
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Comunidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-white"
                  >
                    Segurança
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="mb-4 text-sm text-gray-400 md:mb-0">
                © 2025 Fivest. Todos os direitos reservados.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Termos de Uso
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Política de Privacidade
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GetStarted;
