"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Calendar,
  ChevronRight,
  ChevronsUpDown,
  Command,
  DollarSign,
  Folder,
  Forward,
  GalleryVerticalEnd,
  LineChart,
  MoreHorizontal,
  NotebookIcon,
  Plus,
  Settings2,
  SquareTerminal,
  Target,
  Trash2,
  UserIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/_components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger,
} from "@/app/_components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ModeToggle } from "./ui/theme-provider";

const data = {
  dashboards: [
    {
      name: "Pessoal",
      logo: GalleryVerticalEnd,
      plan: "Premium",
    },
    {
      name: "Família",
      logo: AudioWaveform,
      plan: "Free",
    },
    {
      name: "Amigos",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Transações",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Histórico",
          url: "/transactions",
        },
        {
          title: "Bancos",
          url: "#",
        },
        {
          title: "Cartões de Crédito",
          url: "/credit-cards",
        },
        {
          title: "Categorias",
          url: "#",
        },
      ],
    },
    {
      title: "Investimentos",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Carteira de Investimentos",
          url: "#",
        },
        {
          title: "Explorar Ativos",
          url: "#",
        },
        {
          title: "Simulador",
          url: "/investments/simulator",
        },
        {
          title: "Recomentações de IA",
          url: "#",
        },
        {
          title: "Projeções de Mercado",
          url: "#",
        },
      ],
    },
    {
      title: "Mercado",
      url: "#",
      icon: LineChart,
      items: [
        {
          title: "Bolsa de Valores",
          url: "#",
        },
        {
          title: "Ativos",
          url: "#",
        },
        {
          title: "Ordens",
          url: "#",
        },
        {
          title: "Análises e Relatórios",
          url: "#",
        },
      ],
    },
    {
      title: "Análise Inteligentes",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Insights Financeiros",
          url: "#",
        },
        {
          title: "Padrões de Gasto",
          url: "#",
        },
        {
          title: "Alertas de Economia",
          url: "#",
        },
      ],
    },
    {
      title: "Calendário",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Ver",
          url: "/calendar",
        },
        {
          title: "Lista de Tarefas",
          url: "#",
        },
      ],
    },
    {
      title: "Metas Financeiras",
      url: "#",
      icon: Target,
      items: [
        {
          title: "Metas Ativas",
          url: "/goals",
        },
        {
          title: "Progresso das Metas",
          url: "#",
        },
      ],
    },

    {
      title: "Configurações",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Geral",
          url: "#",
        },
        {
          title: "Perfis",
          url: "#",
        },
        {
          title: "Aparencia",
          url: "#",
        },
      ],
    },
  ],
  about: [
    {
      name: "Fivest Learning",
      url: "#",
      icon: NotebookIcon,
    },
    {
      name: "Suporte",
      url: "#",
      icon: UserIcon,
    },
  ],
};

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const [activeTeam, setActiveTeam] = React.useState(data.dashboards[0]);

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarTrigger
                      className="flex items-center"
                      variant="outline"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start">
                    Abrir menu lateral
                  </TooltipContent>
                </Tooltip>

                <div className="data-[state=open]:invisible">
                  <ModeToggle />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Finanças</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Fivest</SidebarGroupLabel>
            <SidebarMenu>
              {data.about.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48 rounded-lg"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <Folder className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Forward className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <activeTeam.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {activeTeam.name}
                      </span>
                      <span className="truncate text-xs">
                        {activeTeam.plan}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Contas
                  </DropdownMenuLabel>
                  {data.dashboards.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-sm border">
                        <team.logo className="size-4 shrink-0" />
                      </div>
                      {team.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Adicionar Dashboard
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {children}
    </>
  );
}
