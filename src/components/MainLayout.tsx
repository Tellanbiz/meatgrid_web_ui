import { AppSidebar } from "@/components/app-sidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/SidebarInset";
import { Outlet } from "react-router-dom";
import { data } from "@/data/nav-data";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex h-screen overflow-hidden">
        <div className="flex-shrink-0 h-full">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex-shrink-0">
            <TopNavigation items={data.navMain} />
          </div>
          <SidebarInset className="flex-1 w-full overflow-auto">
            <div className="flex flex-1 flex-col p-4 pt-4 w-full">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
