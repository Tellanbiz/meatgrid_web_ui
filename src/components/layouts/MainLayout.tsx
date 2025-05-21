import { TopNavigation } from "@/components/TopNavigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/SidebarInset";
import { Outlet } from "react-router-dom";
import { data } from "@/data/nav-data";
import { SideBar } from "../navigation/Sidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="fixed inset-0 flex h-screen overflow-hidden">
        <div className="flex-shrink-0 h-full">
          <SideBar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <div className="flex-shrink-0">
            <TopNavigation items={data.navMain} />
          </div>
          <SidebarInset className="flex-1 w-full overflow-auto">
            <div className="flex flex-1 flex-col w-full  space-y-6">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
