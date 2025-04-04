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
import Image from "next/image";
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
          url: "/",
        },
        // {
        //   title: "Investimentos",
        //   url: "#",
        // },
        {
          title: "Análises e Relatórios",
          url: "/reports",
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
          url: "/schedule-transaction",
        },
        {
          title: "Cartões de Crédito",
          url: "/credit-cards",
        },
        {
          title: "Categorias",
          url: "/categories",
        },
      ],
    },
    {
      title: "Investimentos",
      url: "#",
      icon: DollarSign,
      items: [
        // {
        //   title: "Carteira de Investimentos",
        //   url: "#",
        // },
        // {
        //   title: "Explorar Ativos",
        //   url: "#",
        // },
        {
          title: "Simulador",
          url: "/investments/simulator",
        },
        // {
        //   title: "Recomentações de IA",
        //   url: "#",
        // },
        // {
        //   title: "Projeções de Mercado",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Planejmanto",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Criar Planjejamento",
          url: "#",
        },
        {
          title: "Calendário",
          url: "/calendar",
        },
        {
          title: "Metas Financeiras",
          url: "/goals",
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
          title: "Política",
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
          url: "/insights",
        },
        {
          title: "PoupAI",
          url: "#",
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
      <NavigationMenuTrigger className="bg-transparent text-white/80 transition-colors hover:bg-white/10 hover:text-white">
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid w-56 gap-1 rounded-lg bg-white p-2 shadow-lg">
          {items.map((item) => (
            <NavigationMenuLink key={item.title} asChild>
              <Link
                href={item.url}
                className="block rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
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

  const [isOpen, setOpen] = useState(false);

  if (pathname === "/get-started") return null;

  return (
    <header className="">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="mx-auto flex min-h-16 items-center justify-between px-12">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-white.svg"
                width={140}
                height={39}
                alt="Fivest"
              />
            </Link>
          </div>

          {/* Center - Navigation Items */}
          <div className="flex flex-1 justify-center gap-4">
            {data.navMain.map((item) => (
              <NavItem
                key={item.title}
                title={item.title}
                icon={item.icon}
                items={item.items}
              />
            ))}
          </div>

          {/* Right Side - Theme Toggle, Notifications and User Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden flex-row items-center gap-4 lg:flex">
              <NotificationsButton />
            </div>

            <UserProfileDropDown />

            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full bg-white shadow-lg lg:hidden">
          <div className="container flex flex-col gap-4 px-8 py-4">
            {data.navMain.map((item) => (
              <div key={item.title} className="border-b pb-2 last:border-b-0">
                <p className="mb-2 text-sm font-semibold text-gray-600">
                  {item.title}
                </p>
                {item.items?.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.url}
                    className="flex items-center justify-between rounded px-4 py-3 transition-colors hover:bg-gray-100"
                  >
                    <span
                      className={
                        pathname === subItem.url
                          ? "font-bold text-blue-600"
                          : "text-gray-700"
                      }
                    >
                      {subItem.title}
                    </span>
                    <MoveRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
