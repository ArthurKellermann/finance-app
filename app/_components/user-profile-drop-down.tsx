"use client";

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Settings,
  Sparkles,
  UserCircle,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { SidebarMenuButton } from "./ui/sidebar";
import { redirect } from "next/navigation";

const UserProfileDropDown = () => {
  const clerk = useClerk();
  const { user } = useUser();

  const userData = {
    name: user?.fullName || "Guest",
    email: user?.emailAddresses[0]?.emailAddress || "guest@example.com",
    avatar: user?.imageUrl || "/avatars/default.jpg",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 transition-all duration-300 hover:from-blue-100 hover:to-purple-100"
        >
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="bg-blue-500 text-white">
              {userData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1 text-left">
            <p className="max-w-[120px] truncate text-sm font-semibold text-gray-800">
              {userData.name}
            </p>
            <p className="max-w-[120px] truncate text-xs text-gray-500">
              {userData.email}
            </p>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-xl border-none bg-white p-2 shadow-2xl"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="mb-2 p-0">
          <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3">
            <Avatar className="border-3 h-12 w-12 border-white shadow-md">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="bg-blue-500 text-white">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-800">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.email}</p>
            </div>
            <UserCircle className="h-6 w-6 text-blue-500" />
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup className="mt-2 space-y-1">
          <Link href="/subscription">
            <DropdownMenuItem className="group cursor-pointer rounded-lg transition-colors hover:bg-blue-50">
              <Sparkles className="mr-2 h-4 w-4 text-purple-500 group-hover:text-purple-600" />
              <span className="text-gray-700 group-hover:text-gray-900">
                Assinaturas
              </span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-gray-200" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem
            onClick={() => clerk.openUserProfile()}
            className="group cursor-pointer rounded-lg transition-colors hover:bg-green-50"
          >
            <BadgeCheck className="mr-2 h-4 w-4 text-green-500 group-hover:text-green-600" />
            <span className="text-gray-700 group-hover:text-gray-900">
              Perfil
            </span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {}}
            className="group cursor-pointer rounded-lg transition-colors hover:bg-yellow-50"
          >
            <Settings className="mr-2 h-4 w-4 text-yellow-500 group-hover:text-yellow-600" />
            <span className="text-gray-700 group-hover:text-gray-900">
              Configurações
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2 bg-gray-200" />

        <DropdownMenuItem
          onClick={() => {
            clerk.signOut();
            redirect("/get-started");
          }}
          className="group cursor-pointer rounded-lg text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-500 group-hover:text-red-600" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropDown;
