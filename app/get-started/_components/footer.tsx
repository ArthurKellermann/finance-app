"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const navigationItems = [
    {
      title: "Início",
      href: "/",
      description: "",
    },
    {
      title: "Produto",
      description: "Simplifique sua gestão financeira com nossas ferramentas.",
      items: [
        {
          title: "Relatórios",
          href: "/relatorios",
        },
        {
          title: "Estatísticas",
          href: "/estatisticas",
        },
        {
          title: "Dashboards",
          href: "/dashboards",
        },
        {
          title: "Transações",
          href: "/transacoes",
        },
      ],
    },
    {
      title: "Empresa",
      description: "Conheça mais sobre nossa missão e valores.",
      items: [
        {
          title: "Sobre nós",
          href: "/sobre",
        },
        {
          title: "Trabalhe conosco",
          href: "/carreiras",
        },
        {
          title: "Investidores",
          href: "/investidores",
        },
        {
          title: "Contato",
          href: "/contato",
        },
      ],
    },
  ];

  return (
    <div className="w-full bg-foreground py-20 text-background lg:py-40">
      <div className="container mx-auto">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col gap-2">
              {isDark ? (
                <Image
                  src="/logo.svg"
                  width={173}
                  height={32}
                  alt="Fivest Logo"
                />
              ) : (
                <Image
                  src="/logo-white.svg"
                  width={173}
                  height={32}
                  alt="Fivest Logo"
                />
              )}
              <p className="max-w-lg text-left text-lg leading-relaxed tracking-tight text-background/75">
                Simplifique sua gestão financeira e tome decisões mais
                assertivas.
              </p>
            </div>
            <div className="flex flex-row gap-20">
              <div className="flex max-w-lg flex-col text-left text-sm leading-relaxed tracking-tight text-background/75">
                <p>São Leopoldo</p>
                <p>Rio Grande do Sul</p>
                <p>+55 51 01234-567</p>
              </div>
              <div className="flex max-w-lg flex-col text-left text-sm leading-relaxed tracking-tight text-background/75">
                <Link href="/">Termos de serviço</Link>
                <Link href="/">Política de Privacidade</Link>
              </div>
            </div>
          </div>

          {/* Links de Navegação */}
          <div className="grid items-start gap-10 lg:grid-cols-3">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-start gap-1 text-base"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-xl">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center justify-between"
                      >
                        <span className="text-background/75">
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
