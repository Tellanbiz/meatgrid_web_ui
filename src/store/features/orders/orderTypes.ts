export interface Recipient {
  id: string;
  picture: string;
  full_name: string;
}

export interface Store {
  id: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export enum OrderStatus {
  Pending = "pending",
  Preparing = "preparing",
  Picked = "picked",
  Dispatch = "dispatch",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export type OperationState =
  | "idle"
  | "cancelling"
  | "cancelled"
  | "deleting"
  | "deleted"
  | "error";

export enum DeliveryMethod {
  Delivery = "delivery",
  ScheduledDelivery = "scheduled_delivery",
  Pickup = "pickup",
}

export interface OrderFilters {
  start_date?: string;
  end_date?: string;
  status?: OrderStatus;
  store_id?: string;
  payment_method_id?: string;
}

export interface Order {
  id: string;
  order_id: number;
  address: string;
  status: OrderStatus;
  total_cost: number;
  recipient: Recipient;
  store: Store;
  payment_method: PaymentMethod;
  delivery_method: DeliveryMethod;
  is_dispatched: boolean;
  created_at: string;
}
