"use client";

import * as React from "react";
import {
  Home,
  Tag,
  Folder,
  Users,
  BarChart2,
  Star,
  BookOpen,
  User,
  Settings,
  Tags,
  Store,
  ShoppingCart,
  Gift,
} from "lucide-react";

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

const data = {
  company: {
    name: "MeatGrid",
    logo: "/images/logo.png",
  },
  navMain: [
    {
      title: "Main",
      url: "#",
      icon: Home,
      isActive: true,
      items: [
        { title: "Dashboard", url: "/" },
        { title: "Reports", url: "/reports", icon: BarChart2 },
      ],
    },
    {
      title: "Product Management",
      url: "#",
      icon: Gift,
      isActive: true,
      items: [
        { title: "Products", url: "/products", icon: Tag },
        { title: "Categories", url: "/categories", icon: Folder },
      ],
    },
    {
      title: "Order Management",
      url: "#",
      icon: ShoppingCart,
      items: [
        { title: "Orders", url: "/orders" },
        { title: "Payment Methods", url: "/payment-methods" },
      ],
    },
    {
      title: "Inventory Management",
      url: "#",
      icon: Store,
      items: [
        { title: "Stock", url: "/stock" },
        { title: "Suppliers", url: "/suppliers" },
        { title: "Warehouses", url: "/warehouses" },
        { title: "Storage Types", url: "/storage-types" },
      ],
    },

    {
      title: "Marketing",
      url: "#",
      icon: Tags,
      items: [
        { title: "Recipes", url: "/recipes", icon: BookOpen },
        { title: "Coupons", url: "/coupons", icon: Star },
        { title: "Banners", url: "/banners" },
        { title: "Promotion Tags", url: "/tags" },
      ],
    },

    {
      title: "User Management",
      url: "#",
      icon: Users,
      items: [
        { title: "Customers", url: "/customers" },
        { title: "Staff Members", url: "/staffs" },
        { title: "Riders", url: "/riders" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        { title: "Personal Settings", url: "/personal-settings", icon: User },
        { title: "Global Settings", url: "/global-settings", icon: Settings },
      ],
    },
  ],
};

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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
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
