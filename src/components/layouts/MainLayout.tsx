import { TopNavigation } from "@/components/navigation/TopNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { SideBar } from "../navigation/Sidebar";
import { sidebarData } from "../navigation/data";
import { cn } from "@/shared/helpers/utils";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex h-screen overflow-hidden">
        <div className="flex-shrink-0 h-full">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex-shrink-0">
            <TopNavigation items={sidebarData.navMain} />
          </div>
          <div
            className={cn(
              "bg-background relative flex flex-1 flex-col w-full overflow-auto",
              "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
              "flex-1 w-full overflow-auto"
            )}
          >
            <div className="flex flex-1 flex-col w-full  space-y-6">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
