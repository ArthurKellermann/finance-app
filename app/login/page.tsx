import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-2">
      {/* Left */}
      <div className="mx-auto flex h-full max-w-[550px] flex-col justify-center p-8">
        <Image
          src="/login.svg"
          alt="Fivest"
          height={39}
          width={173}
          className="mb-8"
        />
        <h1 className="mb-3 text-4xl font-bold">Bem Vindo!</h1>
        <p className="mb-8 text-muted-foreground">
          A Fivest é uma plataforma que ajuda seus usuários a gerenciar suas
          finanças pessoais, com foco em investimentos e controle de despesas
          mensais.
        </p>
        <p className="mb-8 text-muted-foreground">
          A plataforma utiliza Inteligência Artificial (IA) para analisar os
          extratos bancários e transações dos usuários, identificar
          oportunidades de economia e sugerir investimentos personalizados com
          base no perfil financeiro, objetivos e aporte disponível.
        </p>
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="mr-2" />
            Fazer login ou criar conta
          </Button>
        </SignInButton>
      </div>

      {/* Right */}
      <div className="relative h-full w-full">
        <Image
          src="/login.png"
          alt="Faça Login"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;
