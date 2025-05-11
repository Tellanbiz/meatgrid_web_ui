import { createAsyncThunk } from "@reduxjs/toolkit";
import { Order, OrderFilters } from "./orderTypes";
import axios from "../../../service/api";
import { CancelOrderRequest } from "./request/CancelOrderRequest";
import { OrderDetails } from "./request/response/FetchOrderByIdResponse";
import { UpdateOrderStatusRequest } from "./request/UpdateOrderStatusRequest";
import { ApiError } from "../../../types/ApiError";

export const fetchOrders = createAsyncThunk<
  Order[],
  OrderFilters,
  { rejectValue: string }
>("orders/fetchOrders", async (filters, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/admin/orders`, { params: filters });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch orders"
    );
  }
});

export const cancelOrder = createAsyncThunk<
  string,
  CancelOrderRequest,
  { rejectValue: string }
>("orders/cancelOrder", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/orders/cancel`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to cancel order"
    );
  }
});

export const fetchOrderById = createAsyncThunk<
  OrderDetails,
  string,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/orders/${orderId}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch order details"
    );
  }
});

export const updateOrderStatus = createAsyncThunk<
  string,
  UpdateOrderStatusRequest,
  { rejectValue: string }
>("orders/updateOrderStatus", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/orders/update`, payload);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update order status"
    );
  }
});
