import { useEffect, useState } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { format } from "date-fns";
import { orderStatusColors } from "@/shared/constants/StatusColors";
import { OrderStatus } from "@/store/features/orders/orderTypes";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LatestOnlineOrdersProps {
  pageSize?: number;
  startDate: Date | null;
  endDate: Date | null;
}

const LatestOnlineOrders = ({ pageSize = 10, startDate, endDate }: LatestOnlineOrdersProps) => {
  const { latestOrders, loading, fetchLatestOrdersData } = useDashboard();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (startDate && endDate) {
      fetchLatestOrdersData({ 
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        limit: pageSize,
      });
    }
  }, [fetchLatestOrdersData, page, pageSize, startDate, endDate]);

  const handleViewOrder = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  const handleRefresh = () => {
    if (startDate && endDate) {
      fetchLatestOrdersData({ 
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        limit: pageSize,
      });
    }
  };

  const formatStatusName = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);
  const getStatusColor = (status: OrderStatus) => orderStatusColors[status] || "bg-gray-500";

  // Pagination controls (assume 10 pages for now, or you can pass total count from API)
  const totalPages = 10;

  return (
    <div className="bg-white border border-gray-200 p-0 h-fit flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
        <div>
          <h3 className="dashboard-card-title">Latest Online Orders</h3>
          <p className="dashboard-card-subtitle mt-1">Recent orders from the selected period</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading.latestOrders}
          className="hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto flex-1">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="dashboard-label py-4">Order #</TableHead>
              <TableHead className="dashboard-label py-4">Customer</TableHead>
              <TableHead className="dashboard-label py-4">Date</TableHead>
              <TableHead className="dashboard-label py-4">Status</TableHead>
              <TableHead className="dashboard-label py-4">Store</TableHead>
              <TableHead className="dashboard-label py-4">Revenue</TableHead>
              <TableHead className="dashboard-label py-4 w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.latestOrders ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : latestOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-3">📦</div>
                  <div className="dashboard-subtitle">No orders found</div>
                  <div className="dashboard-label mt-1">No orders have been placed in the selected period.</div>
                </TableCell>
              </TableRow>
            ) : (
              latestOrders.map((order) => (
                <TableRow key={order.order_id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="dashboard-stat text-sm py-4">#{order.order_id}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-gray-100">
                        <AvatarImage src={order.recipient.picture} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {order.recipient.full_name.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="dashboard-subtitle text-sm">{order.recipient.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="dashboard-label text-sm py-4">
                    {format(new Date(order.created_at), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={`${getStatusColor(order.status)} text-white font-medium px-3 py-1`}>
                      {formatStatusName(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="dashboard-subtitle text-sm py-4">{order.store.name}</TableCell>
                  <TableCell className="dashboard-stat text-sm py-4">KES {order.total_cost.toFixed(2)}</TableCell>
                  <TableCell className="py-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewOrder(order.order_id)}
                      className="hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
          className="hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="dashboard-label">Page {page} of {totalPages}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
          className="hover:bg-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default LatestOnlineOrders;
