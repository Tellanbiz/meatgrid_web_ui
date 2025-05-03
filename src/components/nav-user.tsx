"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Loader2,
  LogOut,
} from "lucide-react";

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

  function getInitials(fullName: string): string {
    if (!fullName) {
      return "";
    }
    const words = fullName.split(" ");
    let initials = "";
    for (const word of words) {
      if (word.length > 0) {
        initials += word.charAt(0).toUpperCase();
      }
    }
    return initials;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {!user ? (
          <div className="flex items-center space-x-4">
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
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.picture} alt={user.full_name} />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.full_name}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.picture} alt={user.full_name} />
                    <AvatarFallback className="rounded-lg">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.full_name}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onAccountClick}>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onNotificationClick}>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogoutClick} disabled={isLoggingOut}>
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
