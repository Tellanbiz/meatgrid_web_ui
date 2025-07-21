import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "@/components/common/ProgressIndicator";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
import CancelOrderModal from "./CancelOrderModal";
import { Order } from "@/store/features/orders/orderTypes";
import { orderStatusColors } from "@/shared/constants/StatusColors";
import StatusBadge from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersTableProps {
  filteredOrders: Order[];
  isFetchingOrders: boolean;
}

const OrdersTable = ({
  filteredOrders,
  isFetchingOrders,
}: OrdersTableProps) => {
  const navigate = useNavigate();

  // Use proper selector pattern for orders state
  const { selectedOrderNumber, selectedOrderState } = useAppSelector(
    (state) => state.orders
  );

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredOrders]);

  // Handle delete success message
  useEffect(() => {
    if (selectedOrderState === "deleting") {
      toast.success("Order deleted successfully");
    }
  }, [selectedOrderState]);

  // Order status badge template
  const statusTemplate = (rowData: Order) => {
    const colorClass = orderStatusColors[rowData.status];
    return <StatusBadge text={rowData.status} className={colorClass} />;
  };

  // View order handler
  const handleViewOrder = (order: Order) => {
    navigate(`/orders/${order.order_id}`);
  };

  // Cancel order handler
  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order);
    setTimeout(() => setCancelDialogOpen(true), 10);
  };

  // Actions dropdown template
  const actionsTemplate = (order: Order) => {
    const isLoading =
      selectedOrderNumber === order.id &&
      (selectedOrderState === "cancelling" ||
        selectedOrderState === "deleting");

    if (isLoading) {
      return <ProgressIndicator height="28px" width="28px" />;
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleViewOrder(order)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => handleCancelOrder(order)}
            className="flex items-center gap-2 text-red-600"
          >
            <XCircle className="h-4 w-4" /> Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const refreshOrders = () => {
    // This will be handled by parent component
    window.location.reload();
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  if (isFetchingOrders && filteredOrders.length === 0) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-12 w-1/5" />
            <Skeleton className="h-12 w-1/5" />
            <Skeleton className="h-12 w-1/5" />
            <Skeleton className="h-12 w-1/5" />
            <Skeleton className="h-12 w-1/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {isFetchingOrders && <Progress value={undefined} className="h-1" />}

      {/* Table */}
      <div className="flex-1 rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Details</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Cost</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No orders found matching your search criteria.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center px-2">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                          <span className="text-xs font-medium">MG</span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <NavLink
                          to={`/orders/${order.order_id}`}
                          className="text-sm font-semibold text-gray-900 hover:underline"
                        >
                          {`MG${order.order_id}`}
                        </NavLink>
                        <div className="text-xs text-gray-500">
                          {order.recipient.full_name}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{statusTemplate(order)}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {order.total_cost.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {actionsTemplate(order)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 border-t mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and pages around current page
                  const isFirstPage = page === 1;
                  const isLastPage = page === totalPages;
                  const isCurrentPage = page === currentPage;
                  const isNearCurrentPage = Math.abs(page - currentPage) <= 1;

                  if (
                    isFirstPage ||
                    isLastPage ||
                    isCurrentPage ||
                    isNearCurrentPage
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={isCurrentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-4">...</span>
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Use the new CancelOrderModal component */}
      <CancelOrderModal
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        order={orderToCancel}
        onCancelled={refreshOrders}
      />
    </div>
  );
};

export default OrdersTable;
