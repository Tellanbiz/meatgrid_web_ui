import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

import { PrimaryButton, SecondaryButton } from "../../../components/Button";
import OrderProduct from "./OrderProduct";
import Divider from "./Divider";
import { OrderDetails } from "../../../store/features/orders/request/response/FetchOrderByIdResponse";
import { OrderStatus } from "../../../store/features/orders/orderTypes";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { updateOrderStatus } from "../../../store/features/orders/orderThunks";
import { toast } from "sonner";
import { resetUpdateOrderStatusState } from "../../../store/features/orders/orderSlice";

const OrderDetailsComponent = ({ order }: { order: OrderDetails }) => {
  const dispatch = useAppDispatch();
  const {
    status: updateState,
    error,
    successMessage,
  } = useAppSelector((state) => state.orders.updateStatus);

  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >(order.status);

  const groupedProducts = order.products.reduce((acc, product) => {
    const existing = acc.find((p) => p.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ product, quantity: 1 });
    }
    return acc;
  }, [] as { product: (typeof order.products)[number]; quantity: number }[]);

  const originalTotal = order.products.reduce(
    (acc, item) => acc + item.price,
    0
  );
  const discountedTotal = order.products.reduce(
    (acc, item) => acc + (item.promotional_price || item.price),
    0
  );
  const discount = originalTotal - discountedTotal;
  const total = discountedTotal + order.delivery_fee;

  const handleCancel = () => {
    setOpen(false);
  };

  const handleUdateOrderStatus = async () => {
    if (!selectedStatus) return;
    dispatch(
      updateOrderStatus({
        order_id: order.id,
        store_id: order.store.id,
        status: selectedStatus,
      })
    );
  };

  useEffect(() => {
    if (updateState === "succeeded") {
      toast.success(successMessage);
      setOpen(false);
      dispatch(resetUpdateOrderStatusState());
    }

    if (updateState === "failed" && error) {
      toast.error(error.toString() || "Failed to update order status");
    }
  }, [updateState, error, successMessage, dispatch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      <div className="space-y-2">
        <h2 className="text-md font-semibold">Order Items</h2>
        <div className="grid grid-cols-1 gap-2">
          {groupedProducts.map(({ product, quantity }, idx) => (
            <OrderProduct product={product} quantity={quantity} key={idx} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Bill Summary */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Bill Summary</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Item Total:</span>
              <span className="font-bold">
                KES {discountedTotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className="font-bold">
                KES {order.delivery_fee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span className="font-bold text-green-600">
                KES {discount.toLocaleString()}
              </span>
            </div>

            <Divider />

            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-bold">KES {total.toLocaleString()}</span>
            </div>

            {/* Order Status Update Modal Trigger */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <PrimaryButton
                  className="w-full"
                  text="Update Order Status"
                  onClick={() => setOpen(true)}
                />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Order Status</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <Select
                    value={selectedStatus}
                    onValueChange={(value: OrderStatus) =>
                      setSelectedStatus(value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-end gap-x-4">
                    <SecondaryButton text="Cancel" onClick={handleCancel} />
                    <PrimaryButton
                      text={
                        updateState === "loading" ? "Updating..." : "Update"
                      }
                      disabled={updateState === "loading"}
                      onClick={handleUdateOrderStatus}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="shadow-xs border-none gap-y-4">
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={order.recipient.picture}
                alt={order.recipient.full_name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{order.recipient.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.contact_details.phone_number}
                </p>
              </div>
            </div>
            <Divider className="mt-4" />
            <div className="flex items-center space-x-4">
              <Phone className="w-4 h-4 text-gray-600" />
              <span>{order.recipient.phone_number}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Store Details */}
        <Card className="shadow-xs border-none gap-y-4">
          <CardHeader className="mb-0">
            <CardTitle>Store Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex justify-center items-center bg-background text-primary rounded-full h-10 w-10">
                {order.store.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-medium">{order.store.name}</p>
            </div>
            <Divider />
            <p className="text-sm text-gray-600">{order.store.address}</p>
          </CardContent>
        </Card>

        {/* Rider Details (if any) */}
        <Card className="shadow-xs gap-y-4 border-none">
          <CardHeader>
            <CardTitle>Rider Details</CardTitle>
          </CardHeader>
          <CardContent>
            {order.driver ? (
              <>
                <p>{order.driver.full_name}</p>
                <p>{order.driver.phone_number}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No rider assigned</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsComponent;
