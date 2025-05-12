import { FC, JSX } from "react";

interface StatisticCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendColor: string;
  iconColor: string;
  icon: JSX.Element;
  additionalInfo: string;
}

const StatisticCard: FC<StatisticCardProps> = ({
  title,
  value,
  trend,
  trendColor,
  iconColor,
  icon,
  additionalInfo,
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-2 relative">
      {/* Top Row: Icon and Trend */}
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2 items-center">
          <div
            className={`p-2 rounded-full w-10 h-10 flex items-center justify-center ${iconColor}`}
          >
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        </div>

        <div className={`text-sm ${trendColor} flex items-center gap-1`}>
          <span>{trend}</span>
        </div>
      </div>

      {/* Bottom Row: Value and Additional Info */}
      <div className="flex justify-between items-center mt-2">
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm text-gray-400">{additionalInfo}</div>
      </div>
    </div>
  );
};

const StatisticsGrid = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "Kes 256,7642",
      trend: "+10.25",
      trendColor: "text-blue-500",
      iconColor: "bg-blue-500",
      icon: <img src="/icons/total-revenue.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Total Refunds",
      value: "Kes 5,000",
      trend: "+10.25",
      trendColor: "text-blue-500",
      iconColor: "bg-blue-500",
      icon: <img src="/icons/total-refunds.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Total Products",
      value: "783",
      trend: "+10.25",
      trendColor: "text-yellow-500",
      iconColor: "bg-yellow-500",
      icon: <img src="/icons/total-products.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Total Orders",
      value: "56,7642",
      trend: "+10.25",
      trendColor: "text-green-500",
      iconColor: "bg-green-500",
      icon: <img src="/icons/total-orders.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Out of Stock",
      value: "500",
      trend: "+10.25",
      trendColor: "text-red-500",
      iconColor: "bg-red-500",
      icon: <img src="/icons/out-of-stock.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Total Customers",
      value: "15000",
      trend: "+10.25",
      trendColor: "text-orange-500",
      iconColor: "bg-orange-500",
      icon: <img src="/icons/total-customers.svg" className="size-9" />,
      additionalInfo: "+1.01% this week",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatisticsGrid;
