"use client";

import { ChevronRight, FolderIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

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

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Initialize expanded state for active items
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    items.forEach((item) => {
      if (isActiveItem(item) || item.isActive) {
        initialExpanded[item.title] = true;
      }
    });
    setExpandedItems((prev) => ({ ...prev, ...initialExpanded }));
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu className="mt-4 space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.title} className="my-1">
            {!item.items?.length ? (
              <SidebarMenuButton
                asChild
                size="lg"
                tooltip={item.title}
                className="text-[#eee] transition-colors data-[active=true]:bg-primary-500 data-[active=true]:text-white hover:bg-[#2c3238] hover:text-white py-2.5 px-4 font-normal text-sm w-full outline-none focus:outline-none"
                data-active={location.pathname === item.url}
              >
                <NavLink to={item.url} className="flex items-center w-full outline-none">
                  {item.icon ? (
                    <Icon
                      icon={item.icon}
                      width="18"
                      height="18"
                      className="mr-2 opacity-80"
                    />
                  ) : (
                    <span className="w-[18px] h-[18px] mr-2"></span>
                  )}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            ) : (
              <div className="w-full">
                <SidebarMenuButton
                size="lg"
                  tooltip={item.title}
                  data-active={isActiveItem(item)}
                  className="text-[#eee] transition-colors data-[active=true]:bg-primary-500 data-[active=true]:text-white hover:bg-[#2c3238] hover:text-white py-2.5 px-4 font-normal text-sm w-full outline-none focus:outline-none"
                  onClick={() => toggleExpanded(item.title)}
                >
                  {item.icon ? (
                    <Icon
                      icon={item.icon}
                      width="18"
                      height="18"
                      className="mr-2 opacity-80"
                    />
                  ) : (
                    <FolderIcon
                      width="18"
                      height="18"
                      className="mr-2 opacity-80"
                    />
                  )}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={`ml-auto size-4 transition-transform duration-200 ${
                      expandedItems[item.title] ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>

                {expandedItems[item.title] && (
                  <SidebarMenuSub className="bg-[#2c3238] mt-0.5">
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          className="text-[#eee]/90 transition-colors outline-none focus:outline-none"
                          data-active={location.pathname.startsWith(
                            subItem.url
                          )}
                        >
                          <NavLink
                            to={subItem.url}
                            className="w-full py-2.5 pl-3 pr-4 transition-colors data-[active=true]:text-primary-500 data-[active=true]:font-medium hover:bg-[#191e23] hover:text-white text-sm outline-none"
                            data-active={location.pathname.startsWith(
                              subItem.url
                            )}
                            end={subItem.url === "/"}
                          >
                            <span>{subItem.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </div>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
