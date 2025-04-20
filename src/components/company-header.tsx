"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function CompanyHeader({
  company,
}: {
  company: {
    name: string;
    logo: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square w-32 h-12 p-2 items-center justify-center rounded bg-primary-500 text-sidebar-primary-foreground">
            <img
              src={company.logo}
              alt={company.name}
              className="w-32 h-auto object-cover"
            />
          </div>
          <span className="font-medium"> | MeatGrid</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
