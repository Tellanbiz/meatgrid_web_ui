"use client";

import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const RevenueStatistics: FC = () => {
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i).toLocaleString('default', { month: 'short' }),
    revenue: Math.floor(Math.random() * 600) + 400
  }));

  return (
    <div className="bg-white shadow rounded-lg p-4 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Revenue Statistics (ksh/month)</h3>
        <Select defaultValue="thisYear">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thisYear">This Year</SelectItem>
            <SelectItem value="lastYear">Last Year</SelectItem>
            <SelectItem value="lastMonth">Last Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A1A7C4" }} />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip formatter={(value) => `Ksh ${value}`} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueStatistics;
