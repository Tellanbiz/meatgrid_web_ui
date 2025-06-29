import { FC, useState, useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderStatisticsProps {
  startDate: Date | null;
  endDate: Date | null;
}

const OrderStatistics: FC<OrderStatisticsProps> = ({ startDate: _startDate, endDate: _endDate }) => {
  const { yearlyReports, loading, fetchYearlyReportsData } = useDashboard();
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const isLoading = loading.yearlyReports;

  useEffect(() => {
    fetchYearlyReportsData({ year: parseInt(selectedYear) });
  }, [selectedYear, fetchYearlyReportsData]);

  const years = [2025, 2024, 2023, 2022];

  const chartData = yearlyReports.map((report) => ({
    month: report.month_name.substring(0, 3).toUpperCase(),
    orders: report.order_count,
  }));

  return (
    <Card className="bg-white border border-gray-200 p-0 h-full flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="dashboard-card-title">Order Statistics</h3>
          <p className="dashboard-card-subtitle mt-1">Monthly order trends</p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-h-0 ">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <div className="dashboard-label">Loading chart data...</div>
            </div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="text-5xl">📦</div>
              <div className="dashboard-subtitle">No data available</div>
              <div className="dashboard-label">No order data for the selected year.</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: '500' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280', fontWeight: '500' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                label={{ 
                  value: '', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { 
                    textAnchor: 'middle', 
                    fill: '#6b7280',
                    fontSize: '12px',
                    fontWeight: '600'
                  } 
                }}
                tickMargin={10}
              />
              <Tooltip 
                formatter={(value: any) => [value.toLocaleString(), 'Orders']}
                labelStyle={{ color: '#374151', fontWeight: '600', fontSize: '14px' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '12px 16px'
                }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar 
                dataKey="orders" 
                fill="#3b82f6" 
                radius={[6, 6, 0, 0]} 
                barSize={24}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default OrderStatistics;
