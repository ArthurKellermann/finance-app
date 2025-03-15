"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfileDropDown from "./user-profile-drop-down";
import { useTheme } from "next-themes";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/app/_components/ui/navigation-menu";
import { Button } from "@/app/_components/ui/button";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setOpen] = useState(false);

  const navigationItems = [
    {
      title: "Dashboards",
      items: [
        {
          title: "Finanças",
          href: "/",
        },
        {
          title: "Investimentos",
          href: "/investments",
        },
      ],
    },
    {
      title: "Transações",
      href: "/transactions",
    },
    {
      title: "Carteira",
      href: "/portfolio",
    },
    {
      title: "Mercado",
      href: "/market",
    },
    {
      title: "Conexões",
      href: "/connections",
    },
  ];

  return (
    <header className="flex min-h-16 justify-between bg-popover shadow-md">
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
          <NavigationMenu>
            <NavigationMenuList className="flex flex-row gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={
                        pathname === item.href
                          ? "font-bold text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <>
                      <NavigationMenuTrigger
                        className={
                          pathname === "/" || pathname === "/investments"
                            ? "font-bold text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[300px] p-4">
                        <div className="flex flex-col gap-2">
                          {item.items?.map((subItem) => (
                            <NavigationMenuLink
                              href={subItem.href}
                              key={subItem.title}
                              className="flex flex-row items-center justify-between rounded px-4 py-2 hover:bg-muted"
                            >
                              <span>{subItem.title}</span>
                              <MoveRight className="h-4 w-4 text-muted-foreground" />
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>

      <div className="flex items-center gap-4 px-6">
        <UserProfileDropDown />

        <div className="flex lg:hidden">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-20 w-full bg-background lg:hidden">
          <div className="container flex flex-col gap-4 px-8 py-4">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between py-2"
                  >
                    <span
                      className={
                        pathname === item.href
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
                        href={subItem.href}
                        className="flex items-center justify-between rounded px-4 py-2 hover:bg-muted"
                      >
                        <span
                          className={
                            pathname === subItem.href
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
