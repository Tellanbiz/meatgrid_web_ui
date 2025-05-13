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
  selectAuthStatus,
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
  const status = useAppSelector(selectAuthStatus);

  React.useEffect(() => {
    if (!user && !isFetchingAdminAccount) {
      if (status === 'failed') {
        navigate('/login');
      } else {
        dispatch(fetchAdminAccount());
      }
    }
  }, [dispatch, isFetchingAdminAccount, user, status, navigate]);

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
      className="bg-[#23282d] text-white border-r-0 h-full"
      {...props}
    >
      <SidebarHeader className="px-0 py-0 flex-shrink-0">
        <CompanyHeader company={data.company} />
      </SidebarHeader>
      <SidebarContent className="px-0 overflow-y-auto">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="mt-auto flex-shrink-0 border-t border-[#32373c] pt-2">
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
