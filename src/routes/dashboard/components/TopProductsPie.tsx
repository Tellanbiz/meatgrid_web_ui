import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "@/components/ui/card";

const COLORS = [
  "#6366f1", "#22d3ee", "#f59e42", "#10b981", "#f43f5e", "#a21caf", "#fbbf24", "#14b8a6", "#3b82f6", "#eab308"
];

interface TopProductsPieProps {
  startDate: Date | null;
  endDate: Date | null;
}

const TopProductsPie = ({ startDate: _startDate, endDate: _endDate }: TopProductsPieProps) => {
  const { topProducts } = useDashboard();

  // Group by product name since category is not available in ProductReport
  const pieData = useMemo(() => {
    if (!topProducts || topProducts.length === 0) return [];
    
    const byProduct: Record<string, number> = {};
    topProducts.forEach((prod) => {
      byProduct[prod.name] = (byProduct[prod.name] || 0) + prod.order_count;
    });
    
    const total = Object.values(byProduct).reduce((a, b) => a + b, 0);
    return Object.entries(byProduct).map(([name, value], i) => ({
      name,
      value,
      percent: total ? ((value / total) * 100) : 0,
      color: COLORS[i % COLORS.length],
    }));
  }, [topProducts]);

  return (
    <Card className="bg-white border border-gray-200 p-0 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="dashboard-card-title">Sales by Product</h3>
          <p className="dashboard-card-subtitle mt-1">Top selling products distribution</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center flex-1 pr-6">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                labelLine={false}
                isAnimationActive={false}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value} orders`, name]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }} />
              <span className="dashboard-label truncate max-w-[100px]">{entry.name}</span>
              <span className="ml-auto dashboard-stat text-sm">{entry.percent.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TopProductsPie; 