"use client";

import { FC, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const SalesStatistics: FC = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const data = [
    { month: "Jan", onlineOrders: 400, posOrders: 240 },
    { month: "Feb", onlineOrders: 300, posOrders: 139 },
    { month: "Mar", onlineOrders: 200, posOrders: 98 },
    { month: "Apr", onlineOrders: 278, posOrders: 390 },
    { month: "May", onlineOrders: 189, posOrders: 480 },
    { month: "Jun", onlineOrders: 239, posOrders: 380 },
    { month: "Jul", onlineOrders: 349, posOrders: 430 },
    { month: "Aug", onlineOrders: 400, posOrders: 240 },
    { month: "Sep", onlineOrders: 300, posOrders: 139 },
    { month: "Oct", onlineOrders: 200, posOrders: 98 },
    { month: "Nov", onlineOrders: 278, posOrders: 390 },
    { month: "Dec", onlineOrders: 189, posOrders: 480 },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Sales Statistics</h3>
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Select
            onValueChange={(value) => setSelectedYear(value)}
            defaultValue={selectedYear}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <hr className="w-full border-t border-gray-100 mt-4" />
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A1A7C4" }} />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
              tickFormatter={(value) => `Ksh ${value}`}
            />
            <Tooltip formatter={(value: number) => `Ksh ${value}`} />
            <Legend
              layout="horizontal"
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10 }}
              formatter={(value: string) => (
                <span className="text-xs text-gray-500 font-light">
                  {value}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="onlineOrders"
              stroke="#22c55e" // Green for Online Orders
              strokeWidth={2}
              dot={false}
              name="Online Orders"
            />
            <Line
              type="monotone"
              dataKey="posOrders"
              stroke="#f97316" // Orange for POS Orders
              strokeWidth={2}
              dot={false}
              name="POS"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesStatistics;
