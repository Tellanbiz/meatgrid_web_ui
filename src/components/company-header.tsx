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
          className="data-[state=open]:bg-primary data-[state=open]:text-white
          justify-start
          h-14
          px-2
          bg-transparent
          hover:bg-transparent
          hover:text-white
          "
        >
          <div className="flex items-center justify-start h-full text-white space-x-2">
            <div className="size-9 bg-accent flex items-center justify-center rounded-md">
              <span className="text-xl font-bold">{company.name.charAt(0)}</span>
            </div>
            <span className="font-medium text-lg">{company.name}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
