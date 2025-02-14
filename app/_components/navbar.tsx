"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarTrigger } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="flex justify-between bg-popover px-8 py-4 shadow-md">
      {/* Left */}
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image src="/logo.svg" width={173} height={39} alt="Fivest" />
        </Link>
        <Link
          href="/"
          className={
            pathname === "/"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Dashboard
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
        <Link
          href="/subscription"
          className={
            pathname === "/subscription"
              ? "font-bold text-primary"
              : "text-muted-foreground"
          }
        >
          Assinatura
        </Link>
      </div>
      {/* Right */}
      <div className="flex space-x-4">
        <UserButton showName />

        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger className="-ml-1" />
          </TooltipTrigger>
          <TooltipContent side="bottom" align="start">
            Abrir menu lateral
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navbar;
