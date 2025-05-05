import { OrderStatus } from "../store/features/orders/orderTypes";
import { StockStatus } from "../store/features/stock/stockTypes";

export type StatusColors = { [key: string]: string };

export const transactionStatusColors: StatusColors = {
  Paid: "bg-green-500 text-white",
  Pending: "bg-yellow-500 text-white",
};

export const paymentStatusColors: StatusColors = {
  Paid: "bg-green-500 text-white",
  Pending: "bg-yellow-500 text-white",
  Failed: "bg-red-500 text-white",
};

export const inventoryStatusColor: StatusColors = {
  OutOfStock: "bg-gray-500 text-white",
};

export const orderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "bg-yellow-200 text-yellow-800",
  [OrderStatus.Preparing]: "bg-blue-200 text-blue-800",
  [OrderStatus.Picked]: "bg-indigo-200 text-indigo-800",
  [OrderStatus.Dispatch]: "bg-purple-200 text-purple-800",
  [OrderStatus.Delivered]: "bg-green-500 text-white",
  [OrderStatus.Cancelled]: "bg-red-200 text-red-800",
};

export const stockStatusColors: Record<StockStatus, string> = {
  [StockStatus.InStock]: "bg-green-500 text-white",
  [StockStatus.Sold]: "bg-blue-500 text-white",
  [StockStatus.Reclaim]: "bg-yellow-500 text-white",
  [StockStatus.Processed]: "bg-purple-500 text-white",
  [StockStatus.Migrated]: "bg-red-500 text-white",
};
