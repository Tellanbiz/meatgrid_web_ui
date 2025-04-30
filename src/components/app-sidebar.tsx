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
  Book,
  Bell,
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

const data = {
  company: {
    name: "MeatGrid",
    logo: "/images/tellan-logo.png",
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
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        { title: "Personal Settings", url: "/personal-settings", icon: User },
        { title: "Global Settings", url: "/global-settings", icon: Settings },
      ],
    },
  ],
  user: {
    name: "Samwel Njuguna",
    email: "snjuguna@tellanbusiness.com",
    avatar: "/avatars/samwel.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanyHeader company={data.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
