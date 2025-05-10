import { FC, JSX, useState } from "react";
import { DatePicker } from "@/components/DatePicker";

interface OrderStatusCardProps {
  title: string;
  value: number;
  trend: string;
  trendColor: string;
  icon: JSX.Element;
  additionalInfo: string;
}

const OrderStatusCard: FC<OrderStatusCardProps> = ({
  title,
  value,
  trend,
  trendColor,
  icon,
  additionalInfo,
}) => (
  <div className="bg-background shadow-xs rounded-lg p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <div
        className={`p-2 rounded-full ${trendColor.replace(
          "text-",
          "bg-"
        )} bg-opacity-20 w-10 h-10 flex items-center justify-center`}
      >
        <span className={`${trendColor}`}>{icon}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <div className="text-lg font-semibold">{value}</div>
    <div className="flex justify-between items-center">
      <div className={`text-sm ${trendColor} flex items-center gap-1`}>
        <span>{trend}</span>
      </div>
      <div className="text-sm text-gray-400">{additionalInfo}</div>
    </div>
  </div>
);

const OrderStatus: FC = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date()); // Default to current day
  const [endDate, setEndDate] = useState<Date | undefined>(new Date()); // Default to current day

  const statuses = [
    {
      title: "Pending",
      value: 7642,
      trend: "+10.25",
      trendColor: "text-orange-500",
      icon: <span className="text-white">📦</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Confirmed",
      value: 9765,
      trend: "+10.25",
      trendColor: "text-green-500",
      icon: <span className="text-white">✅</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Packaging",
      value: 742,
      trend: "+10.25",
      trendColor: "text-blue-500",
      icon: <span className="text-white">📦</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Out for Delivery",
      value: 75,
      trend: "+10.25",
      trendColor: "text-purple-500",
      icon: <span className="text-white">🚚</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Delivered",
      value: 94,
      trend: "+10.25",
      trendColor: "text-green-500",
      icon: <span className="text-white">📬</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Canceled",
      value: 64,
      trend: "-10.25",
      trendColor: "text-red-500",
      icon: <span className="text-white">❌</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Returned",
      value: 7,
      trend: "+10.25",
      trendColor: "text-blue-500",
      icon: <span className="text-white">🔄</span>,
      additionalInfo: "+1.01% this week",
    },
    {
      title: "Delivery Failed",
      value: 21,
      trend: "-10.25",
      trendColor: "text-orange-500",
      icon: <span className="text-white">🚫</span>,
      additionalInfo: "+1.01% this week",
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Order Status</h2>
        <div className="flex items-center gap-1">
          <DatePicker
            selectedDate={startDate}
            onDateChange={setStartDate}
            placeholder="Start Date"
          />
          -
          <DatePicker
            selectedDate={endDate}
            onDateChange={setEndDate}
            placeholder="End Date"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statuses.map((status, index) => (
          <OrderStatusCard key={index} {...status} />
        ))}
      </div>
    </div>
  );
};

export default OrderStatus;