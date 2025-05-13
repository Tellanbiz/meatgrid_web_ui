import { FC, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchYearlyReport } from "@/store/features/reports/reportThunks";
import {
  selectYearlyReport,
  selectIsFetchingYearlyReports,
} from "@/store/features/reports/reportSelectors";
import { Loader2 } from "lucide-react";

const OrderStatistics: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedYear, setSelectedYear] = useState(2025);
  const yearlyReport = useSelector(selectYearlyReport);
  const isLoading = useSelector(selectIsFetchingYearlyReports);

  useEffect(() => {
    dispatch(fetchYearlyReport({ year: selectedYear }));
  }, [selectedYear, dispatch]);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Statistics</h3>
        <Select
          onValueChange={(value) => setSelectedYear(Number(value))}
          defaultValue={selectedYear.toString()}
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
      <hr className="w-full border-t border-gray-100 my-4" />
      <div className="w-full h-64 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={yearlyReport}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month_name"
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "order_count")
                  return [`${value} Orders`, "Orders"];
                return [`${value.toLocaleString()} KES`, "Revenue"];
              }}
              labelStyle={{ color: "#374151" }}
            />
            <Bar
              name="Orders"
              dataKey="order_count"
              fill="#22c55e"
              radius={[5, 5, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStatistics;
