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

  const isActiveItem = (item: { url: string; items?: { url: string }[] }) => {
    // For direct menu items like Dashboard, check exact match
    if (!item.items?.length) {
      return location.pathname === item.url;
    }
    
    // For menu sections (with #), check if any child route matches
    if (item.url === "#") {
      return item.items.some(
        (subItem) =>
          location.pathname.startsWith(subItem.url) ||
          location.pathname === subItem.url
      );
    }
    
    return location.pathname.startsWith(item.url);
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            {!item.items?.length ? (
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="text-white transition-colors data-[active=true]:bg-primary data-[active=true]:text-white hover:bg-primary/20 hover:text-white py-4 px-2"
                data-active={location.pathname === item.url}
              >
                <NavLink to={item.url} className="flex items-center w-full">
                  {item.icon && (
                    <Icon
                      icon={item.icon}
                      width="20"
                      height="20"
                      className="mr-2"
                    />
                  )}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            ) : (
              <Collapsible
                defaultOpen={item.isActive || isActiveItem(item)}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    data-active={isActiveItem(item)}
                    className="text-white transition-colors data-[active=true]:bg-primary data-[active=true]:text-white hover:bg-primary/20 hover:text-white py-4 px-2"
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
                          data-active={location.pathname.startsWith(subItem.url)}
                        >
                          <NavLink
                            to={subItem.url}
                            className="w-full rounded-md py-4 px-2 transition-colors data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:font-medium hover:bg-primary/20 hover:text-white"
                            data-active={location.pathname.startsWith(subItem.url)}
                            end={subItem.url === "/"}
                          >
                            <span>{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
