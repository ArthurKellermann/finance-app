"use client";

import { CalendarIcon, Check, MoveRight } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { format } from "date-fns";
import { Label } from "@/app/_components/ui/label";
import { Input } from "@/app/_components/ui/input";

export const Contact = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Seção de Informações */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <Badge>Contato</Badge>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl">
                  Transforme sua gestão financeira
                </h4>
                <p className="max-w-sm text-left text-lg leading-relaxed tracking-tight text-muted-foreground">
                  Gerir suas finanças e investimentos pode ser complexo.
                  Simplifique com ferramentas modernas e intuitivas.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6 text-left">
              <Check className="mt-2 h-4 w-4 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Fácil de usar</p>
                <p className="text-sm text-muted-foreground">
                  Uma plataforma intuitiva para todos os níveis de experiência.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6 text-left">
              <Check className="mt-2 h-4 w-4 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Rápido e confiável</p>
                <p className="text-sm text-muted-foreground">
                  Processamento ágil e seguro de suas transações e dados.
                </p>
              </div>
            </div>
            <div className="flex flex-row items-start gap-6 text-left">
              <Check className="mt-2 h-4 w-4 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Design moderno</p>
                <p className="text-sm text-muted-foreground">
                  Interface limpa e agradável para uma experiência fluida.
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Agendamento */}
          <div className="flex items-center justify-center">
            <div className="flex max-w-sm flex-col gap-4 rounded-md border p-8">
              <p>Agendar uma reunião</p>
              <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full max-w-sm justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="firstname">Nome</Label>
                <Input id="firstname" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="lastname">Sobrenome</Label>
                <Input id="lastname" type="text" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1">
                <Label htmlFor="file">Anexar arquivo (opcional)</Label>
                <Input id="file" type="file" />
              </div>

              <Button className="w-full gap-4">
                Agendar reunião <MoveRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
