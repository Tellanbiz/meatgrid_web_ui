import { useEffect, useState } from "react";
import { RefreshCcw, FileSpreadsheet, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOrders } from "@/store/features/orders/orderThunks";
import {
  selectIsFetchingOrders,
  selectOrders,
} from "@/store/features/orders/orderSelectors";
import { Input } from "@/components/ui/input";
import StockDateRangePicker from "@/routes/manufacturing/stocks/components/StockDateRangePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, OrderFilters } from "@/store/features/orders/orderTypes";
import { selectStores } from "@/store/features/stores/storeSelectors";
import { fetchStores } from "@/store/features/stores/storeThunks";
import { selectPaymentMethods } from "@/store/features/payment-methods/paymentMethodSelectors";
import { fetchPaymentMethods } from "@/store/features/payment-methods/paymentMethodThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";
import OrdersTable from "./components/OrdersTable";

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const isFetchingOrders = useAppSelector(selectIsFetchingOrders);
  const orders = useAppSelector(selectOrders);
  const stores = useAppSelector(selectStores);
  const paymentMethods = useAppSelector(selectPaymentMethods);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 60);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => new Date());
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");

  // Fetch initial data (stores and payment methods)
  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  // Fetch orders with backend filters whenever filter states change
  useEffect(() => {
    // Don't search if user is still selecting date range (has only start date)
    if (startDate && !endDate) {
      return;
    }

    const filters: Partial<OrderFilters> = {};

    // Add date filters if they exist and are valid dates
    if (startDate && startDate instanceof Date && !isNaN(startDate.getTime())) {
      filters.start_date = startDate.toISOString().split("T")[0];
    }
    if (endDate && endDate instanceof Date && !isNaN(endDate.getTime())) {
      filters.end_date = endDate.toISOString().split("T")[0];
    }

    // Add other filters if they're not "all"
    if (selectedStatus !== "all") {
      filters.status = selectedStatus as OrderStatus;
    }
    if (selectedStore !== "all") {
      filters.store_id = selectedStore;
    }
    if (selectedPaymentMethod !== "all") {
      filters.payment_method_id = selectedPaymentMethod;
    }

    // Clean up filters object to remove any undefined/null values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    ) as OrderFilters;

    dispatch(fetchOrders(cleanFilters));
  }, [
    dispatch,
    startDate,
    endDate,
    selectedStatus,
    selectedStore,
    selectedPaymentMethod,
  ]);

  const handleRefresh = () => {
    // Don't refresh if user is still selecting date range
    if (startDate && !endDate) {
      return;
    }

    const filters: Partial<OrderFilters> = {};

    // Add date filters if they exist and are valid dates
    if (startDate && startDate instanceof Date && !isNaN(startDate.getTime())) {
      filters.start_date = startDate.toISOString().split("T")[0];
    }
    if (endDate && endDate instanceof Date && !isNaN(endDate.getTime())) {
      filters.end_date = endDate.toISOString().split("T")[0];
    }

    // Add other filters if they're not "all"
    if (selectedStatus !== "all") {
      filters.status = selectedStatus as OrderStatus;
    }
    if (selectedStore !== "all") {
      filters.store_id = selectedStore;
    }
    if (selectedPaymentMethod !== "all") {
      filters.payment_method_id = selectedPaymentMethod;
    }

    // Clean up filters object to remove any undefined/null values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      )
    ) as OrderFilters;

    dispatch(fetchOrders(cleanFilters));
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Only filter by search term (order ID) on frontend
    // Backend already handles date, status, store, and payment method filtering
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_id.toString().includes(searchTerm.toLowerCase()) ||
          `MG${order.order_id}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const aggregateOrders = () => {
    const filteredOrders = getFilteredOrders();

    return filteredOrders.map((order) => ({
      "Order ID": `MG${order.order_id}`,
      Customer: order.recipient.full_name,
      Address: order.address,
      Status: order.status,
      "Total Cost": `KSH ${order.total_cost.toLocaleString()}`,
      Store: order.store?.name || "N/A",
      "Payment Method": order.payment_method?.name || "N/A",
      "Created At": new Date(order.created_at).toLocaleString(),
    }));
  };

  const handleExportExcel = () => {
    const data = aggregateOrders();
    exportToExcel(data, "orders-report");
  };

  const handleExportPDF = () => {
    const data = aggregateOrders();
    exportToPDF(data, "orders-report");
  };

  return (
    <div className="h-full p-6 bg-white">
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <StockDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
            />

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.values(OrderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedPaymentMethod}
              onValueChange={setSelectedPaymentMethod}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Methods</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetchingOrders}
            >
              <RefreshCcw
                className={`h-4 w-4 ${isFetchingOrders ? "animate-spin" : ""}`}
              />
              <span className="ml-2">Refresh</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileSpreadsheet className="h-4 w-4" />
                  <span className="ml-2">Export</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleExportExcel}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleExportPDF}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="h-table">
        <OrdersTable
          filteredOrders={getFilteredOrders()}
          isFetchingOrders={isFetchingOrders}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
