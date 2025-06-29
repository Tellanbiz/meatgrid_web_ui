import { useDashboard } from "../hooks/useDashboard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopSellingProps {
  startDate: Date | null;
  endDate: Date | null;
}

const TopSelling = ({ startDate: _startDate, endDate: _endDate }: TopSellingProps) => {
  const { topProducts, loading } = useDashboard();

  return (
    <div className="bg-white border border-gray-200 p-0 h-full flex flex-col shadow-sm rounded-md">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h3 className="dashboard-card-title">Top Products</h3>
          <p className="dashboard-card-subtitle mt-1">Best performing products by orders</p>
      </div>
      <div className="overflow-x-auto flex-1">
        <Table className="min-w-[500px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="dashboard-label py-4">Product</TableHead>
              <TableHead className="dashboard-label py-4 text-center">Orders</TableHead>
              <TableHead className="dashboard-label py-4 text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.topProducts ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : topProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="dashboard-subtitle">No products found</div>
                  <div className="dashboard-label mt-1">No top products in the selected period.</div>
                </TableCell>
              </TableRow>
            ) : (
              topProducts.map((product, index) => (
                <TableRow key={product.product_id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="dashboard-subtitle">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="dashboard-stat">{product.order_count.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="dashboard-stat">KES {product.total_revenue.toLocaleString()}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopSelling;
