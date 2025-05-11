import { useCallback, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import StatusBadge from "../../../components/StatusBadge";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

import { orderStatusColors } from "../../../constants/StatusColors";
import {
  Order,
  OrderStatus,
  OrderFilters,
} from "../../../store/features/orders/orderTypes";
import { DurationOption, getDateRange } from "../../../utils/dateUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, XCircle, Search } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { fetchOrders } from "../../../store/features/orders/orderThunks";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import ProgressIndicator from "../../../components/ProgressIndicator";
import { toast } from "sonner";
import { NavLink } from "react-router-dom";
import { DatePicker } from "../../../components/DatePicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";

import { selectStores } from "../../../store/features/stores/storeSelectors";
import { selectPaymentMethods } from "../../../store/features/payment-methods/paymentMethodSelectors";
import CancelOrderModal from "./CancelOrderModal";
import { selectIsFetchingOrders } from "../../../store/features/orders/orderSelectors";
import { ProgressBar } from "primereact/progressbar";
import { fetchStores } from "../../../store/features/stores/storeThunks";
import { fetchPaymentMethods } from "../../../store/features/payment-methods/paymentMethodThunks";

const OrdersTable = () => {
  const dispatch = useAppDispatch();

  // Use proper selector pattern for orders state
  const { orders, selectedOrderNumber, selectedOrderState } = useAppSelector(
    (state) => state.orders
  );
  const isFetchingOrders = useAppSelector(selectIsFetchingOrders);

  // Get data from selectors using the consistent pattern from other components
  const stores = useAppSelector(selectStores);
  const paymentMethods = useAppSelector(selectPaymentMethods);

  // Existing states
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
    null
  );

  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);

  // Filter states
  const [selectedDuration, setSelectedDuration] =
    useState<DurationOption>("this_month");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  // Dropdown states
  const [storeSearchTerm, setStoreSearchTerm] = useState("");
  const [paymentMethodSearchTerm, setPaymentMethodSearchTerm] = useState("");
  const [statusSearchTerm, setStatusSearchTerm] = useState("");

  // Popover states
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [storePopoverOpen, setStorePopoverOpen] = useState(false);
  const [paymentMethodPopoverOpen, setPaymentMethodPopoverOpen] =
    useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

  // Cancel order states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  // Date ranges for quick select
  const quickDateOptions = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "last_7_days" },
    { label: "Last 30 days", value: "last_30_days" },
    { label: "This Month", value: "this_month" },
  ];

  // Fetch orders with updated filters
  useEffect(() => {
    const filters: OrderFilters = {};

    if (selectedDuration !== "custom") {
      const [start_date, end_date] = getDateRange(selectedDuration);
      filters.start_date = start_date;
      filters.end_date = end_date;
    } else if (startDate && endDate) {
      filters.start_date = startDate.toISOString().split("T")[0];
      filters.end_date = endDate.toISOString().split("T")[0];
    }

    if (selectedStore) {
      filters.store_id = selectedStore;
    }

    if (selectedPaymentMethod) {
      filters.payment_method_id = selectedPaymentMethod;
    }

    if (selectedStatus) {
      filters.status = selectedStatus;
    }

    dispatch(fetchOrders(filters));
  }, [
    dispatch,
    selectedDuration,
    startDate,
    endDate,
    selectedStore,
    selectedPaymentMethod,
    selectedStatus,
  ]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const refreshOrders = useCallback(() => {
    const filters: OrderFilters = {};
    console.log("Selected Duration:", selectedDuration);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    if (selectedDuration !== "custom") {
      const [start_date, end_date] = getDateRange(selectedDuration);
      filters.start_date = start_date;
      filters.end_date = end_date;
    } else if (startDate && endDate) {
      filters.start_date = startDate.toISOString().split("T")[0];
      filters.end_date = endDate.toISOString().split("T")[0];
    }

    if (selectedStore) {
      filters.store_id = selectedStore;
    }

    if (selectedPaymentMethod) {
      filters.payment_method_id = selectedPaymentMethod;
    }

    if (selectedStatus) {
      filters.status = selectedStatus;
    }

    dispatch(fetchOrders(filters));
  }, [
    dispatch,
    selectedDuration,
    startDate,
    endDate,
    selectedStore,
    selectedPaymentMethod,
    selectedStatus,
  ]);

  // Handle delete success message
  useEffect(() => {
    if (selectedOrderState === "deleting") {
      toast.success("Order deleted successfully");
    }
  }, [selectedOrderState]);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  // Handle date range selection
  // Handle date range selection
  const handleDateRangeChange = (value: DurationOption) => {
    setSelectedDuration(value);
    console.log("Selected Duration:", value);
    if (value !== "custom") {
      const [start_date, end_date] = getDateRange(value);
      console.log("Start Date:", start_date);
      console.log("End Date:", end_date);
      // Convert string dates to Date objects for UI display
      setStartDate(new Date(start_date));
      setEndDate(new Date(end_date));
      setDatePopoverOpen(false);
    }
  };

  // Handle custom date range selection
  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      setSelectedDuration("custom");
      setDatePopoverOpen(false);
    }
  };

  const handleStatusChange = (value: OrderStatus | null) => {
    setSelectedStatus(value);
    setStatusPopoverOpen(false);
  };

  const handleStoreChange = (value: string | null) => {
    setSelectedStore(value);
    setStorePopoverOpen(false);
  };

  const handlePaymentMethodChange = (value: string | null) => {
    setSelectedPaymentMethod(value);
    setPaymentMethodPopoverOpen(false);
  };

  // Filter dropdown items
  const filteredStores = stores?.filter((store) =>
    store.name.toLowerCase().includes(storeSearchTerm.toLowerCase())
  );

  const filteredPaymentMethods = paymentMethods?.filter((method) =>
    method.name.toLowerCase().includes(paymentMethodSearchTerm.toLowerCase())
  );

  // Filter order statuses for the dropdown
  const filteredOrderStatuses = Object.values(OrderStatus).filter((status) =>
    status.toLowerCase().includes(statusSearchTerm.toLowerCase())
  );

  // Order status badge template
  const statusTemplate = (rowData: Order) => {
    const colorClass = orderStatusColors[rowData.status];
    return <StatusBadge text={rowData.status} className={colorClass} />;
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
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label="Actions"
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuItem onClick={() => handleCancelOrder(order)}>
            <XCircle className="text-red-400" />{" "}
            <span className="text-red-400">Cancel</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Get selected items labels for display
  const getSelectedStoreLabel = () => {
    if (!selectedStore) return "All Stores";
    const store = stores?.find((s) => s.id === selectedStore);
    return store?.name || "All Stores";
  };

  const getSelectedPaymentMethodLabel = () => {
    if (!selectedPaymentMethod) return "All Methods";
    const method = paymentMethods?.find((m) => m.id === selectedPaymentMethod);
    return method?.name || "All Methods";
  };

  const getSelectedStatusLabel = () => {
    if (!selectedStatus) return "All Status";
    // Format status name for display (capitalize first letter)
    return (
      selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1) ||
      "All Status"
    );
  };

  const getSelectedDateLabel = () => {
    // Format function for consistent date display
    const formatDate = (date: Date | string) => {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    // For custom date selection
    if (selectedDuration === "custom" && startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    // For quick selections, calculate and show the actual date range
    const [start_date, end_date] = getDateRange(selectedDuration);

    // Return formatted date range based on date strings from getDateRange
    return `${formatDate(start_date)} - ${formatDate(end_date)}`;
  };
  // Format status display
  const formatStatusName = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter dropdowns
  const filterDropdowns = (
    <div className="flex flex-wrap gap-4 px-4 py-3 bg-gray-50 border-b">
      {/* Date Range Filter */}
      <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-3 bg-white">
            {getSelectedDateLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-2 border-b">
            <div className="font-medium mb-2">Quick Select</div>
            <div className="grid grid-cols-2 gap-2">
              {quickDateOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    selectedDuration === option.value ? "default" : "outline"
                  }
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    handleDateRangeChange(option.value as DurationOption)
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-2">
            <div className="font-medium mb-2">Custom Range</div>
            <div className="grid gap-2">
              <DatePicker
                selectedDate={startDate}
                onDateChange={setStartDate}
                placeholder="Start Date"
              />
              <DatePicker
                selectedDate={endDate}
                onDateChange={setEndDate}
                placeholder="End Date"
              />
              <Button
                onClick={handleCustomDateChange}
                disabled={!startDate || !endDate}
                className="w-full"
              >
                Apply Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Store Filter */}
      <Popover open={storePopoverOpen} onOpenChange={setStorePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-3 bg-white">
            {getSelectedStoreLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-4 py-2 h-9 border rounded-md text-sm"
                value={storeSearchTerm}
                onChange={(e) => setStoreSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto py-1">
            <div
              className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                !selectedStore ? "bg-blue-50" : ""
              }`}
              onClick={() => handleStoreChange(null)}
            >
              <div className="flex items-center">
                <span>All Stores</span>
                {!selectedStore && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </div>
            </div>

            {filteredStores?.map((store) => (
              <div
                key={store.id}
                className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                  selectedStore === store.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleStoreChange(store.id)}
              >
                <div className="flex items-center">
                  <span>{store.name}</span>
                  {selectedStore === store.id && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Payment Method Filter */}
      <Popover
        open={paymentMethodPopoverOpen}
        onOpenChange={setPaymentMethodPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-3 bg-white">
            {getSelectedPaymentMethodLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-4 py-2 h-9 border rounded-md text-sm"
                value={paymentMethodSearchTerm}
                onChange={(e) => setPaymentMethodSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto py-1">
            <div
              className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                !selectedPaymentMethod ? "bg-blue-50" : ""
              }`}
              onClick={() => handlePaymentMethodChange(null)}
            >
              <div className="flex items-center">
                <span>All Methods</span>
                {!selectedPaymentMethod && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </div>
            </div>

            {filteredPaymentMethods?.map((method) => (
              <div
                key={method.id}
                className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                  selectedPaymentMethod === method.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handlePaymentMethodChange(method.id)}
              >
                <div className="flex items-center">
                  <span>{method.name}</span>
                  {selectedPaymentMethod === method.id && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Popover open={statusPopoverOpen} onOpenChange={setStatusPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 px-3 bg-white">
            {getSelectedStatusLabel()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-8 pr-4 py-2 h-9 border rounded-md text-sm"
                value={statusSearchTerm}
                onChange={(e) => setStatusSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-auto py-1">
            <div
              className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                !selectedStatus ? "bg-blue-50" : ""
              }`}
              onClick={() => handleStatusChange(null)}
            >
              <div className="flex items-center">
                <span>All Status</span>
                {!selectedStatus && (
                  <span className="ml-auto text-blue-600">✓</span>
                )}
              </div>
            </div>

            {filteredOrderStatuses.map((status) => (
              <div
                key={status}
                className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                  selectedStatus === status ? "bg-blue-50" : ""
                }`}
                onClick={() => handleStatusChange(status)}
              >
                <div className="flex items-center">
                  <span>{formatStatusName(status)}</span>
                  {selectedStatus === status && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <div className="h-full">
      {isFetchingOrders && (
        <ProgressBar mode="indeterminate" style={{ height: "6px" }} />
      )}

      {/* DataTable for orders */}
      <DataTable
        value={filteredOrders}
        dataKey="id"
        tableStyle={DataTableStyle}
        size="small"
        selectionMode="checkbox"
        selection={selectedOrders}
        onSelectionChange={(e) => setSelectedOrders(e.value)}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        scrollable
        scrollHeight="flex"
        header={filterDropdowns}
      >
        <Column
          header="Order ID"
          body={(order: Order) => (
            <NavLink to={`/orders/${order.order_id}`} className="underline">
              {`MG${order.order_id}`}
            </NavLink>
          )}
          headerStyle={TableHeaderStyle}
          className="font-bold text-xs"
        />

        <Column
          header="Full Name"
          body={(order: Order) => order.recipient.full_name}
          headerStyle={TableHeaderStyle}
          className="text-xs"
        />
        <Column
          field="address"
          header="Address"
          headerStyle={TableHeaderStyle}
          className="text-xs"
        />
        <Column
          field="orderStatus"
          header="Status"
          body={(rowData) => statusTemplate(rowData)}
          headerStyle={TableHeaderStyle}
          className="text-xs"
        />
        <Column
          field="total"
          header="Total Cost"
          body={(order: Order) => (
            <span className="text-xs">KES {order.total_cost.toFixed(2)}</span>
          )}
          headerStyle={TableHeaderStyle}
          className="text-xs"
        />
        <Column
          field="createdAt"
          header="Created At"
          body={(order: Order) =>
            new Date(order.created_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          }
          headerStyle={TableHeaderStyle}
          className="text-xs"
        />
        <Column
          body={actionsTemplate}
          header="Actions"
          headerStyle={TableHeaderStyle}
          style={{ width: "4rem", textAlign: "center" }}
        />
      </DataTable>

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
