"use client";

import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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

  // Check if a navigation item should be active based on current route
  const isActiveItem = (item: { url: string; items?: { url: string }[] }) => {
    if (item.url === "#") {
      // For menu sections (with #), check if any child route matches or starts with child url
      return item.items?.some(
        (subItem) =>
          location.pathname.startsWith(subItem.url) ||
          location.pathname === subItem.url
      );
    }

    if (item.url === "/") {
      // For dashboard, only exact match
      return location.pathname === "/";
    }

    // For other items, check if current path starts with item url
    return location.pathname.startsWith(item.url);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive || isActiveItem(item)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  data-active={isActiveItem(item)}
                  className="text-white transition-colors data-[active=true]:bg-primary data-[active=true]:text-white hover:bg-primary/20 hover:text-white"
                >
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      width="20"
                      height="20"
                      className={isActiveItem(item) ? "text-white" : ""}
                    />
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-sidebar-border">
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        className="text-white/80 transition-colors"
                        data-active={location.pathname === subItem.url}
                      >
                        <NavLink
                          to={subItem.url}
                          className="w-full rounded-md p-2 transition-colors data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:font-medium hover:bg-primary/20 hover:text-white"
                          data-active={location.pathname === subItem.url}
                          end={subItem.url === "/"}
                        >
                          <span>{subItem.title}</span>
                        </NavLink>
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
  );
}
