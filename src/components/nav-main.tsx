"use client";

import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: string;
    }[];
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup className="w-56">
      <SidebarMenu className="mt-4 space-y-4">
        <div className="space-y-1">
          <h3 className="px-4 text-sm font-medium text-gray-400">General</h3>
          <SidebarMenuItem className="my-1">
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Dashboard"
              className="text-[#eee] transition-colors data-[active=true]:bg-primary-500 data-[active=true]:text-white hover:bg-[#2c3238] hover:text-white py-2.5 px-4 font-normal text-sm w-full outline-none focus:outline-none"
              data-active={location.pathname === "/"}
            >
              <NavLink to="/" className="flex items-center w-full outline-none">
                <Icon
                  icon="lucide:layout-dashboard"
                  width="18"
                  height="18"
                  className="mr-2 opacity-80"
                />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </div>

        {items.map((item) => (
          <div key={item.title} className="space-y-1">
            <h3 className="px-4 text-sm font-medium text-gray-400">
              {item.title}
            </h3>
            {item.items?.map((subItem) => (
              <SidebarMenuItem key={subItem.title} className="my-1">
                <SidebarMenuButton
                  asChild
                  size="lg"
                  tooltip={subItem.title}
                  className="text-[#eee] transition-colors data-[active=true]:bg-primary-500 data-[active=true]:text-white hover:bg-[#2c3238] hover:text-white py-2.5 px-4 font-normal text-sm w-full outline-none focus:outline-none"
                  data-active={location.pathname.startsWith(subItem.url)}
                >
                  <NavLink
                    to={subItem.url}
                    className="flex items-center w-full outline-none"
                  >
                    {subItem.icon ? (
                      <Icon
                        icon={subItem.icon}
                        width="18"
                        height="18"
                        className="mr-2 opacity-80"
                      />
                    ) : (
                      <span className="w-[18px] h-[18px] mr-2"></span>
                    )}
                    <span>{subItem.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
