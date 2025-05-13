"use client";

import { BadgeCheck, Bell, Loader2, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AdminAccount } from "../store/features/auth/authTypes";
import { Skeleton } from "./ui/skeleton";

interface NavUserProps {
  user: AdminAccount | null;
  isLoggingOut: boolean;
  onAccountClick: () => void;
  onNotificationClick: () => void;
  onLogoutClick: () => void;
}

export function NavUser({
  user,
  isLoggingOut,
  onAccountClick,
  onNotificationClick,
  onLogoutClick,
}: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <div className="flex items-center space-x-4 px-4 py-2">
            {/* Skeleton for Avatar */}
            <Skeleton className="h-8 w-8 rounded-full" />
            {/* Skeleton for Text */}
            <div className="flex flex-col space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="px-4 py-2 hover:bg-[#32373c] transition-colors duration-200 w-full justify-start"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 rounded-full overflow-hidden bg-[#00a0d2]">
                    <AvatarImage src={user.picture} alt={user.full_name} />
                    <AvatarFallback className="bg-[#00a0d2] text-white">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2 text-left text-sm">
                    <span className="text-[#b4b9be] text-xs">Howdy,</span>
                    <span className="ml-1 text-sm text-white">
                      {user.full_name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-3 py-2 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                    <AvatarImage src={user.picture} alt={user.full_name} />
                    <AvatarFallback className="bg-[#00a0d2] text-white">
                      <User size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.full_name}
                    </span>
                    <span className="truncate text-xs text-gray-500">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={onAccountClick}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <BadgeCheck className="size-4 text-[#00a0d2]" />
                  <span>Your Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onNotificationClick}
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <Bell className="size-4 text-[#00a0d2]" />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-600"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
