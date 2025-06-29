import { useDashboard } from "../hooks/useDashboard";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

const CombinedStatsChart = () => {
  const { combinedStats, loading } = useDashboard();

  // Custom tooltip formatter
  const formatTooltip = (value: any, name: string) => {
    if (name === 'Revenue') {
      return [`$${value.toLocaleString()}`, name];
    }
    return [value.toLocaleString(), name];
  };

  // Custom axis formatter
  const formatYAxis = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)}k`;
    }
    return tickItem;
  };

  const formatRevenueAxis = (tickItem: any) => {
    if (tickItem >= 1000) {
      return `$${(tickItem / 1000).toFixed(0)}k`;
    }
    return `$${tickItem}`;
  };

  return (
    <Card className="bg-white border border-gray-200 p-0 h-full flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-lg font-semibold">Revenue & Orders (Current Year)</h3>
        {loading.yearlyReports && (
          <div className="text-xs text-muted-foreground">Loading...</div>
        )}
      </div>
      <div className="flex-1 min-h-0 p-4">
        {loading.yearlyReports ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div className="text-sm text-muted-foreground">Loading chart data...</div>
            </div>
          </div>
        ) : combinedStats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <div className="text-4xl">📊</div>
              <div className="font-medium">No data available</div>
              <div className="text-xs">No revenue and order data for the current year.</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={combinedStats} 
              margin={{ top: 16, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                tickFormatter={formatYAxis}
                label={{ value: 'Orders', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6b7280' } }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                tickFormatter={formatRevenueAxis}
                label={{ value: 'Revenue ($)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#6b7280' } }}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelStyle={{ color: '#374151', fontWeight: '600' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingBottom: '8px' }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="order_count" 
                fill="#3b82f6" 
                name="Orders"
                radius={[4, 4, 0, 0]} 
                barSize={20}
                opacity={0.8}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                name="Revenue"
                strokeWidth={3} 
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default CombinedStatsChart; 