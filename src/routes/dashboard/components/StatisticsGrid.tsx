import { FC, JSX } from "react";
import { useDashboard } from "../../../routes/dashboard/hooks/useDashboard";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatisticCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendColor: string;
  icon: JSX.Element;
  additionalInfo: string;
}

interface StatisticsGridProps {
  startDate: Date | null;
  endDate: Date | null;
}

const StatisticCard: FC<StatisticCardProps> = ({
  title,
  value,
  trend,
  trendColor,
  icon,
  additionalInfo,
}) => {
  const isPositive = trend.startsWith('+');
  return (
    <Card className="border-0 shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-muted text-primary">
            {icon}
          </div>
          <div>
            <p className="dashboard-label">{title}</p>
            <p className="dashboard-stat text-2xl leading-tight">{value}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${trendColor} font-semibold text-sm tracking-tight`}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{trend}</span>
        </div>
      </div>
      <p className="dashboard-label mt-1">{additionalInfo}</p>
    </Card>
  );
};

const StatisticsGrid: FC<StatisticsGridProps> = ({ startDate: _startDate, endDate: _endDate }) => {
  const { dashboardStatistics, loading } = useDashboard();
  const isLoading = loading.dashboardStatistics;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm p-4 flex flex-col gap-2">
            <div className="flex items-center justify-center h-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Use direct growth percentages from API
  const revenueGrowth = dashboardStatistics?.total_revenue_growth_percentage ?? 0;
  const orderGrowth = dashboardStatistics?.total_order_growth_percentage ?? 0;
  const userGrowth = dashboardStatistics?.total_user_growth_percentage ?? 0;

  // Calculate total orders from order status counts
  const totalOrders = dashboardStatistics?.order_status_counts 
    ? Object.values(dashboardStatistics.order_status_counts).reduce((sum, count) => sum + count, 0)
    : 0;

  const stats = [
    {
      title: "Total Revenue",
      value: dashboardStatistics ? `KES ${dashboardStatistics.total_revenue.toLocaleString()}` : "KES 0",
      trend: `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(2)}%`,
      trendColor: revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
      additionalInfo: "Growth from previous period",
    },
    {
      title: "Total Products",
      value: dashboardStatistics ? dashboardStatistics.total_products.toLocaleString() : "0",
      trend: '+0.00%',
      trendColor: 'text-blue-600',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
      additionalInfo: "Total products in system",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      trend: `${orderGrowth >= 0 ? '+' : ''}${orderGrowth.toFixed(2)}%`,
      trendColor: orderGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      additionalInfo: "Growth from previous period",
    },
    {
      title: "Total Users",
      value: dashboardStatistics ? dashboardStatistics.total_users.toLocaleString() : "0",
      trend: `${userGrowth >= 0 ? '+' : ''}${userGrowth.toFixed(2)}%`,
      trendColor: userGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
      additionalInfo: "Growth from previous period",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatisticsGrid;
