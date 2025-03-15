import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { Providers } from "./_components/providers";
import { dark } from "@clerk/themes";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Fivest",
  description: "Seu gerenciador de finanças pessoais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${mulish.className} bg-background-color-home text-foreground antialiased`}
      >
        <ClerkProvider localization={ptBR} appearance={{ baseTheme: dark }}>
          <Providers>
            <div className="flex h-full flex-col overflow-hidden">
              {children}
            </div>
          </Providers>
        </ClerkProvider>

        <Toaster theme="dark" />
      </body>
    </html>
  );
}
