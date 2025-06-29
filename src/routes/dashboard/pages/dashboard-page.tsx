import { useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import LatestOnlineOrders from "@/routes/dashboard/components/LatestOnlineOrders";
import StatisticsGrid from "@/routes/dashboard/components/StatisticsGrid";
import TopProductsPie from "@/routes/dashboard/components/TopProductsPie";
import TopStores from "@/routes/dashboard/components/TopStores";
import TopSelling from "@/routes/dashboard/components/TopSelling";
import OrderStatistics from "@/routes/dashboard/components/OrderStatistics";
import RevenueStatistics from "@/routes/dashboard/components/RevenueStatistics";

const DashboardPage = () => {
  const { fetchAllDashboardData } = useDashboard();

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="dashboard-title text-3xl mb-2">Dashboard</h1>
        <p className="dashboard-subtitle text-gray-600">Monitor your business performance and key metrics</p>
      </div>

      {/* Statistics Grid */}
      <StatisticsGrid />

      {/* Revenue & Order Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <RevenueStatistics />
        </div>
        <div className="h-96">
          <OrderStatistics />
        </div>
      </div>

      {/* Latest Online Orders - Full Width */}
      <div className="h-[500px]">
        <LatestOnlineOrders pageSize={10} />
      </div>

      {/* Product Category Pie and Top Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <TopProductsPie />
        </div>
        <div className="h-96">
          <TopSelling />
        </div>
      </div>

      {/* Top Stores - Full Width */}
      <div className="h-96">
        <TopStores />
      </div>
    </div>
  );
};

export default DashboardPage; 