"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserProfileDropDown from "./user-profile-drop-down";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex justify-between bg-popover px-8 py-4 shadow-md">
      {/* Left */}
      <div className="flex items-center gap-10">
        <Link href="/">
          {isDark ? (
            <Image src="/logo-white.svg" width={173} height={39} alt="Fivest" />
          ) : (
            <Image src="/logo.svg" width={173} height={39} alt="Fivest" />
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={
              pathname === "/"
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }
          >
            Dashboards
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href="/"
                className={
                  pathname === "/" ? "font-bold" : "text-muted-foreground"
                }
              >
                Finanças
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href="/investments"
                className={
                  pathname === "/investments"
                    ? "font-bold"
                    : "text-muted-foreground"
                }
              >
                Investimentos
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          href="/transactions"
          className={
            pathname === "/transactions"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Transações
        </Link>
        <Link
          href="/portfolio"
          className={
            pathname === "/portfolio"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Carteira
        </Link>
        <Link
          href="/market"
          className={
            pathname === "/market"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Mercado
        </Link>
        <Link
          href="/connections"
          className={
            pathname === "/connections"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Conexões
        </Link>
      </div>
      {/* Right */}
      <div className="flex h-[30px] items-center">
        <UserProfileDropDown />
      </div>
    </div>
  );
};

export default Navbar;
