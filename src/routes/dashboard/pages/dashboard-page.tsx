import { useEffect, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import LatestOnlineOrders from "@/routes/dashboard/components/LatestOnlineOrders";
import StatisticsGrid from "@/routes/dashboard/components/StatisticsGrid";
import TopProductsPie from "@/routes/dashboard/components/TopProductsPie";
import TopStores from "@/routes/dashboard/components/TopStores";
import TopSelling from "@/routes/dashboard/components/TopSelling";
import OrderStatistics from "@/routes/dashboard/components/OrderStatistics";
import RevenueStatistics from "@/routes/dashboard/components/RevenueStatistics";
import DashboardDateRangePicker from "../components/DashboardDateRangePicker";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const DashboardPage = () => {
  const { fetchAllDashboardData, loading } = useDashboard();
  
  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleRefresh = () => {
    if (startDate && endDate) {
      const params = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      };
      fetchAllDashboardData(params);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const params = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
      };
      fetchAllDashboardData(params);
    }
  }, [startDate, endDate, fetchAllDashboardData]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="dashboard-title text-3xl mb-2">Dashboard</h1>
            <p className="dashboard-subtitle text-gray-600">Monitor your business performance and key metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <DashboardDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading.dashboardStatistics}
            >
              <RefreshCcw
                className={`h-4 w-4 ${loading.dashboardStatistics ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <StatisticsGrid startDate={startDate} endDate={endDate} />

      {/* Revenue & Order Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
        <div className="h-[500px]">
          <RevenueStatistics startDate={startDate} endDate={endDate} />
        </div>
        <div className="h-[500px]">
          <OrderStatistics startDate={startDate} endDate={endDate} />
        </div>
      </div>

      {/* Product Category Pie and Top Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-96">
          <TopProductsPie startDate={startDate} endDate={endDate} />
        </div>
        <div className="h-96">
          <TopSelling startDate={startDate} endDate={endDate} />
        </div>
      </div>

      {/* Top Stores - Full Width */}
      <div className="h-fit">
        <TopStores startDate={startDate} endDate={endDate} />
      </div>

      {/* Latest Online Orders - Full Width */}
      <div className="">
        <LatestOnlineOrders pageSize={10} startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

export default DashboardPage; 