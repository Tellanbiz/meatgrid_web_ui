import { useCallback, useEffect, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import StatusBadge from "../../../components/StatusBadge";
import OrdersTableHeader from "./OrdersTableHeader";
import {
  DataTableStyle,
  TableHeaderStyle,
} from "../../../constants/TableStyles";

import { orderStatusColors } from "../../../constants/StatusColors";
import {
  Order,
  OrderStatus,
} from "../../../store/features/orders/orderTypes.ts";
import { LoadingState } from "../../../types/LoadingStatus.ts";
import LoadingPage from "../../../components/LoadingPage.tsx";
import { DurationOption, getDateRange } from "../../../utils/dateUtils.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EllipsisVertical, Pencil, XCircle } from "lucide-react";
import { Button } from "../../../components/ui/button.tsx";
import {
  cancelOrder,
  fetchOrders,
} from "../../../store/features/orders/orderThunks.ts";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import ProgressIndicator from "../../../components/ProgressIndicator.tsx";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { resetCancelOrderState } from "../../../store/features/orders/orderSlice.ts";

const OrdersTable = () => {
  const dispatch = useAppDispatch();
  const {
    orders,
    status,
    error,
    selectedOrderNumber,
    selectedOrderState,
    successMessage,
  } = useAppSelector((state) => state.orders);

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
  const [selectedDuration] = useState<DurationOption>("this_month");

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

  const cancelSchema = z.object({
    reason: z.string().min(1, "Reson for cancelling order is required"),
  });

  type CancelFormVaues = z.infer<typeof cancelSchema>;
  const form = useForm<CancelFormVaues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: "",
    },
  });

  const orderStatusOptions = [
    { label: "All", value: "All" },
    ...Object.values(OrderStatus).map((status) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
    })),
  ];

  useEffect(() => {
    const { start_date, end_date } = getDateRange(selectedDuration);
    dispatch(fetchOrders({ start_date, end_date }));
  }, [dispatch, selectedDuration]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const refreshOrders = useCallback(() => {
    const { start_date, end_date } = getDateRange(selectedDuration);
    dispatch(fetchOrders({ start_date, end_date }));
  }, [dispatch, selectedDuration]);

  useEffect(() => {
    if (selectedOrderState == "cancelled") {
      setCancelDialogOpen(false);
      form.reset();
      toast.success(successMessage ?? "Order cancelled successfully");
      dispatch(resetCancelOrderState());

      refreshOrders();
    }

    if (selectedOrderState == "deleting") {
      toast.success("Order deleted successfully");
    }
    if (selectedOrderState == "error") {
      toast.error(error);
    }
  }, [
    selectedOrderState,
    error,
    successMessage,
    form,
    refreshOrders,
    dispatch,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    filterOrders(value, selectedStatus);
  };

  const handleStatusChange = (e: { value: string | null }) => {
    setSelectedStatus(e.value);

    if (e.value === "All") {
      setSearchTerm("");
      setFilteredOrders(orders);
    } else {
      filterOrders(searchTerm, e.value);
    }
  };

  const filterOrders = (search: string, status: string | null) => {
    let filtered = orders.filter(
      (order) =>
        order.order_id.toString().includes(search) ||
        order.order_id.toString().includes(search)
    );

    if (status && status !== "All") {
      filtered = filtered.filter((order) => order.status === status);
    }

    setFilteredOrders(filtered);
  };

  const statusTemplate = (rowData: Order) => {
    const colorClass = orderStatusColors[rowData.status];
    return <StatusBadge text={rowData.status} className={colorClass} />;
  };

  const handleEdit = (order: Order) => {
    console.log("Edit order " + order.id);
  };

  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order);
    setTimeout(() => setCancelDialogOpen(true), 10);
  };

  const handleConfirmCancelOrder = async (data: CancelFormVaues) => {
    if (!orderToCancel) return;

    await dispatch(
      cancelOrder({
        order_id: orderToCancel.id,
        cancel_reason: data.reason,
      })
    );
  };

  const handleCancelForm = () => {
    setCancelDialogOpen(false);
    setOrderToCancel(null);
    form.reset();
  };

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
          <DropdownMenuItem onClick={() => handleEdit(order)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleCancelOrder(order)}>
            <XCircle className="text-red-400" />{" "}
            <span className="text-red-400">Cancel</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (status == LoadingState.Loading) {
    return <LoadingPage />;
  }

  return (
    <div className="card">
      <DataTable
        value={filteredOrders}
        dataKey="id"
        tableStyle={DataTableStyle}
        selection={selectedOrders}
        size="small"
        selectionMode="checkbox"
        onSelectionChange={(e) => {
          setSelectedOrders(Array.isArray(e.value) ? e.value : []);
        }}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        scrollable
        scrollHeight="500px"
        header={
          <OrdersTableHeader
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
            orderStatusOptions={orderStatusOptions}
          />
        }
      >
        <Column selectionMode="multiple" headerStyle={TableHeaderStyle} />
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

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md transition-all duration-100 ease-in-out">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleConfirmCancelOrder)}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogDescription>
                  Please provide a reason for cancelling order{" "}
                  <span className="font-bold">MG{orderToCancel?.order_id}</span>
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Reason for cancellation"
                        className="w-full h-24 p-2 border border-input rounded-md resize-none text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedOrderState == "cancelling" ? (
                    <>
                      <ProgressIndicator
                        height="30px"
                        width="30px"
                        className="px-12 py-2"
                      />
                    </>
                  ) : (
                    "Confirm Cancel"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersTable;
