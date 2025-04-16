import { createAsyncThunk } from "@reduxjs/toolkit";
import { Order, OrderFilters } from "./orderTypes";
import axios from "../../../service/api";
import { CancelOrderRequest } from "./request/CancelOrderRequest";
import { CancelOrderResponse } from "./request/response/CancelOrderRespons";

export const fetchOrders = createAsyncThunk<
  Order[],
  OrderFilters,
  { rejectValue: string }
>("orders/fetchOrders", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value);
      }
    });

    const response = await axios.get(`/admin/orders?${params.toString()}`);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch orders"
    );
  }
});

export const cancelOrder = createAsyncThunk<
  CancelOrderResponse,
  CancelOrderRequest,
  { rejectValue: string }
>("orders/cancelOrder", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/orders/cancel`, payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to cancel order"
    );
  }
});
