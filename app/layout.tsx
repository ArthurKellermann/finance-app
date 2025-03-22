import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { Toaster } from "sonner";
import { dark } from "@clerk/themes";
import { TooltipProvider } from "./_components/ui/tooltip";
import { auth } from "@clerk/nextjs/server";
import Navbar from "./_components/navbar";
import { SidebarProvider } from "./_components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { NotificationsProvider } from "./_contexts/notifications-context";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Fivest",
  description: "Seu gerenciador de finanças pessoais e investimentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  return (
    <html lang="en" className="!scroll-smooth">
      <body
        className={`${mulish.className} bg-background-color-home text-foreground antialiased`}
      >
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ClerkProvider localization={ptBR} appearance={{ baseTheme: dark }}>
            <NotificationsProvider>
              <TooltipProvider>
                <SidebarProvider>
                  <div className="flex h-full flex-col overflow-hidden">
                    {userId ? (
                      <>
                        <Navbar />
                        {children}
                      </>
                    ) : (
                      children
                    )}
                  </div>
                </SidebarProvider>
              </TooltipProvider>
            </NotificationsProvider>
          </ClerkProvider>

          <Toaster theme="dark" />
        </ThemeProvider>
      </body>
    </html>
  );
}
