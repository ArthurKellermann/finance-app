import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

const NavbarSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleInvestmentsMenu = () => {
    setIsInvestmentsOpen(!isInvestmentsOpen);
  };

  return (
    <div className="relative">
      <Button onClick={toggleSidebar} variant="link" className="p-2">
        <Menu />
      </Button>

      {typeof window !== "undefined" && (
        <div
          className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-50 transition-opacity duration-300 ${
            isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            className={`fixed right-0 top-0 z-20 h-full w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <Button
              onClick={toggleSidebar}
              variant="link"
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
            >
              <X />
            </Button>

            <h2 className="mb-4 text-xl font-semibold">Menu</h2>

            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonBox: "flex flex-row-reverse items-center gap-2",
                  userButtonOuterIdentifier: "text-right",
                },
              }}
            />

            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={toggleInvestmentsMenu}
                  className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Investimentos
                  <span>{isInvestmentsOpen ? "▲" : "▼"}</span>
                </a>
                {isInvestmentsOpen && (
                  <ul className="ml-4 mt-2 space-y-2">
                    <li>
                      <a
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-blue-500"
                      >
                        Conta
                      </a>
                    </li>
                    <li>
                      <a
                        href="/"
                        className="text-sm font-medium text-gray-600 hover:text-blue-500"
                      >
                        Conexões
                      </a>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <a
                  href="/portfolio"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Carteira
                </a>
              </li>
              <li>
                <a
                  href="/gastos"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Gastos
                </a>
              </li>
              <li>
                <a
                  href="/reports"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Relatórios
                </a>
              </li>
              <li>
                <a
                  href="/goals"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Metas Financeiras
                </a>
              </li>
              <li>
                <a
                  href="/settings"
                  className="text-sm font-medium text-gray-700 hover:text-blue-500"
                >
                  Configurações
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarSidebar;
