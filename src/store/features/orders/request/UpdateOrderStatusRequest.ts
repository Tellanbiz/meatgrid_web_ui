import { OrderStatus } from "../orderTypes";

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  order_id: string;
  store_id: string;
}
