"use client";
import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";

import { ArrowDown, MoveRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["economizar", "investir", "gerenciar", "cuidar", "evoluir"],
    [],
  );

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full" id="hero">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 py-20 lg:py-40">
          <div>
            {!isDark ? (
              <Image
                src="/logo-white.svg"
                width={173}
                height={39}
                alt="Fivest"
              />
            ) : (
              <Image src="/logo.svg" width={173} height={39} alt="Fivest" />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-regular max-w-2xl text-center text-5xl tracking-tighter md:text-7xl">
              <span className="text-spektr-cyan-50">Aqui você pode</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="max-w-2xl text-center text-lg leading-relaxed tracking-tight text-muted-foreground md:text-xl">
              A Fivest é uma plataforma que ajuda seus usuários a gerenciar suas
              finanças pessoais, com foco em investimentos e controle de
              despesas mensais.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <a href="#features">
              <Button size="lg" className="gap-4" variant="outline">
                Ver funcionalidades <ArrowDown className="h-4 w-4" />
              </Button>{" "}
            </a>

            <Button size="lg" className="gap-4">
              Se increva aqui <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
