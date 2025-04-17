import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Topbar />
      <div className="flex flex-1 overflow-hidden mt-16">
        <Sidebar />

        <main className="flex-1 overflow-y-auto m-6 h-full scrollbar-hide bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;