"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/app/_lib/utils";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("h-7 w-7")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
