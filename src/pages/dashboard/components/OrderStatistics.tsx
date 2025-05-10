import { FC, useState } from "react";
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

const OrderStatistics: FC = () => {
  const [selectedYear, setSelectedYear] = useState("2025");

  const data = [
    { month: "Jan", orders: 800 },
    { month: "Feb", orders: 950 },
    { month: "Mar", orders: 600 },
    { month: "Apr", orders: 850 },
    { month: "May", orders: 700 },
    { month: "Jun", orders: 900 },
    { month: "Jul", orders: 750 },
    { month: "Aug", orders: 800 },
    { month: "Sep", orders: 850 },
    { month: "Oct", orders: 900 },
    { month: "Nov", orders: 950 },
    { month: "Dec", orders: 700 },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Statistics</h3>
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
      <hr className="w-full border-t border-gray-100 my-4" />
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#A1A7C4" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#A1A7C4" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip formatter={(value: number) => `${value} Orders`} />
            <Bar
              dataKey="orders"
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
