"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { CompanyHeader } from "@/components/company-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectAuthUser,
  selectIsFetchingAdminAccount,
  selectIsLoggingOut,
  selectLogoutSuccess,
} from "../store/features/auth/authSelectors";
import {
  fetchAdminAccount,
  logoutUser,
} from "../store/features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import { data } from "@/data/nav-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const isFetchingAdminAccount = useAppSelector(selectIsFetchingAdminAccount);
  const isLoggingOut = useAppSelector(selectIsLoggingOut);
  const logoutSuccess = useAppSelector(selectLogoutSuccess);

  React.useEffect(() => {
    if (!user) {
      dispatch(fetchAdminAccount());
    }
  }, [dispatch, isFetchingAdminAccount, user]);

  React.useEffect(() => {
    if (logoutSuccess) {
      navigate("/login");
    }
  }, [logoutSuccess, navigate]);

  const handleAccountClick = () => {
    console.log("Account clicked");
  };

  const handleNotificationClick = () => {
    console.log("Notifications clicked");
  };

  const handleLogoutClick = () => {
    dispatch(logoutUser());
  };

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="bg-[#151922] text-white border-r-0 h-full"
      {...props}
    >
      <SidebarHeader className="px-4 py-2 flex-shrink-0">
        <CompanyHeader company={data.company} />
      </SidebarHeader>
      <SidebarContent className="px-2 overflow-y-auto">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="mt-auto flex-shrink-0">
        <NavUser
          user={user}
          isLoggingOut={isLoggingOut}
          onAccountClick={handleAccountClick}
          onNotificationClick={handleNotificationClick}
          onLogoutClick={handleLogoutClick}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
