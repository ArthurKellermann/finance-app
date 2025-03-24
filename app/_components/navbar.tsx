"use client";

import { Button } from "@/app/_components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/app/_components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ModeToggle } from "./ui/theme-provider";
import {
  AudioWaveform,
  Bot,
  Calendar,
  Command,
  DollarSign,
  GalleryVerticalEnd,
  LineChart,
  SquareTerminal,
} from "lucide-react";
import UserProfileDropDown from "./user-profile-drop-down";
import NotificationsButton from "./notifications-button";

const data = {
  dashboards: [
    {
      name: "Pessoal",
      logo: GalleryVerticalEnd,
      plan: "Premium",
    },
    {
      name: "Família",
      logo: AudioWaveform,
      plan: "Free",
    },
    {
      name: "Amigos",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboards",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Finanças",
          url: "/transactions",
        },
        {
          title: "Investimentos",
          url: "#",
        },
        {
          title: "Análises e Relatórios",
          url: "#",
        },
      ],
    },
    {
      title: "Transações",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Histórico",
          url: "/transactions",
        },
        {
          title: "Programar Transação",
          url: "#",
        },
        {
          title: "Cartões de Crédito",
          url: "/credit-cards",
        },
        {
          title: "Categorias",
          url: "#",
        },
      ],
    },
    {
      title: "Investimentos",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Carteira de Investimentos",
          url: "#",
        },
        {
          title: "Explorar Ativos",
          url: "#",
        },
        {
          title: "Simulador",
          url: "/investments/simulator",
        },
        {
          title: "Recomentações de IA",
          url: "#",
        },
        {
          title: "Projeções de Mercado",
          url: "#",
        },
      ],
    },
    {
      title: "Conexões",
      url: "#",
      icon: LineChart,
      items: [
        {
          title: "Bancos",
          url: "#",
        },
        {
          title: "Ativos",
          url: "#",
        },
        {
          title: "Ordens",
          url: "#",
        },
      ],
    },
    {
      title: "Análise Inteligentes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Insights Financeiros",
          url: "#",
        },
        {
          title: "Padrões de Gasto",
          url: "#",
        },
        {
          title: "Alertas de Economia",
          url: "#",
        },
      ],
    },
    {
      title: "Planejmanto",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Calendário",
          url: "/calendar",
        },
        {
          title: "Lista de Tarefas",
          url: "#",
        },
        {
          title: "Metas Financeiras",
          url: "/goals",
        },
      ],
    },
  ],
};

const NavItem = ({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: any;
  items: { title: string; url: string }[];
}) => (
  <NavigationMenu>
    <NavigationMenuItem className="list-none">
      <NavigationMenuTrigger>
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-56 gap-1 p-2">
          {items.map((item) => (
            <NavigationMenuLink key={item.title} asChild>
              <Link
                href={item.url}
                className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                {item.title}
              </Link>
            </NavigationMenuLink>
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenu>
);

const Navbar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="flex min-h-16 justify-between overflow-visible bg-popover shadow-md">
      {/* Left Side */}
      <div className="flex items-center gap-10 px-6">
        <Link href="/">
          {isDark ? (
            <Image src="/logo-white.svg" width={173} height={39} alt="Fivest" />
          ) : (
            <Image src="/logo.svg" width={173} height={39} alt="Fivest" />
          )}
        </Link>

        <div className="hidden flex-row items-center gap-4 lg:flex">
          {data.navMain.map((item) => (
            <NavItem
              key={item.title}
              title={item.title}
              icon={item.icon}
              items={item.items}
            />
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 px-6">
        <div className="hidden flex-row items-center gap-4 lg:flex">
          <ModeToggle />
          <NotificationsButton />
        </div>
        <UserProfileDropDown />

        <div className="flex lg:hidden">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-20 w-full bg-background lg:hidden">
          <div className="container flex flex-col gap-4 px-8 py-4">
            {data.navMain.map((item) => (
              <div key={item.title}>
                {item.url ? (
                  <Link
                    href={item.url}
                    className="flex items-center justify-between py-2"
                  >
                    <span
                      className={
                        pathname === item.url
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {item.title}
                    </span>
                    <MoveRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="py-2 font-bold">{item.title}</p>
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.url}
                        className="flex items-center justify-between rounded px-4 py-2 hover:bg-muted"
                      >
                        <span
                          className={
                            pathname === subItem.url
                              ? "font-bold text-primary"
                              : "text-muted-foreground"
                          }
                        >
                          {subItem.title}
                        </span>
                        <MoveRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
