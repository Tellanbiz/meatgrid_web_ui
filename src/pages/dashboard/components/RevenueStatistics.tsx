"use client";

import { FC, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { fetchYearlyReport } from "../../../store/features/reports/reportThunks";
import { selectYearlyReport, selectIsFetchingYearlyReports } from "../../../store/features/reports/reportSelectors";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const RevenueStatistics: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const yearlyReport = useSelector(selectYearlyReport);
  const isLoading = useSelector(selectIsFetchingYearlyReports);

  useEffect(() => {
    dispatch(fetchYearlyReport({ year: parseInt(selectedYear) }));
  }, [selectedYear, dispatch]);

  const years = ["2025", "2024", "2023", "2022"];

  return (
    <div className="bg-white shadow rounded-lg p-4 col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Revenue Statistics (ksh/month)</h3>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full h-[300px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={yearlyReport}>
            <CartesianGrid strokeDasharray="2 2" vertical={false} />
            <XAxis 
              dataKey="month_name" 
              tick={{ fontSize: 12, fill: "#A1A7C4" }} 
            />
            <YAxis
              axisLine={false}
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
              tickFormatter={(value) => `${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number) => [`Ksh ${value.toLocaleString()}`, "Revenue"]}
              labelStyle={{ color: "#374151" }}
              contentStyle={{ 
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                padding: "8px"
              }}
            />
            <Line
              type="monotone"
              dataKey="monthly_revenue"
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
