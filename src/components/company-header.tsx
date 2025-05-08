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
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground
          justify-start p-2
          h-16
          "
        >
          <div className="flex p-2 items-center justify-start text-sidebar-primary-foreground h-40 space-x-4">
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-40 object-cover"
            />
            <span className="font-medium text-xl text-red-500">
              {" "}
              | MeatGrid
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
