import { FC } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const OrderSummary: FC = () => {
  const data = [
    { name: "Vegetables & Fruits", value: 400, color: "#22c55e" },
    { name: "Meat & Fish", value: 300, color: "#f97316" },
    { name: "Cooking", value: 200, color: "#facc15" },
    { name: "Snacks", value: 150, color: "#a855f7" },
    { name: "Frozen Food", value: 100, color: "#3b82f6" },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-center items-center">
      <div className="flex items-center w-full">
        <h3 className="text-lg font-medium text-left w-full">Order Summary</h3>
      </div>
      <hr className="w-full border-t border-gray-100 my-4" />
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70} // Adjusted for better spacing
              innerRadius={40} // Adjusted for better spacing
              paddingAngle={5} // Adds spacing between segments
              labelLine={false} // Removes label lines for a cleaner look
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} Orders`} />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={10}
              layout="horizontal"
              wrapperStyle={{
                paddingTop: "30px",
                fontSize: "12px",
                color: "#4B5563",
              }}
              formatter={(value: string) => (
                <span className="text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderSummary;
