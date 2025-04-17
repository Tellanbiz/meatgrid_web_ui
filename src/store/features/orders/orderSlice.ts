import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { OperationState, Order } from "./orderTypes";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrders,
  updateOrderStatus,
} from "./orderThunks";
import { CancelOrderResponse } from "./request/response/CancelOrderResponse";
import { OrderDetails } from "./request/response/FetchOrderByIdResponse";

interface OrderState {
  orders: Order[];
  selectedOrderNumber: string | null;
  selectedOrderState: OperationState;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
  selectedOrderDetails: OrderDetails | null;
  updateStatus: {
    status: LoadingStatus;
    error: string | null;
    successMessage: string | null;
  };
}

const initialState: OrderState = {
  orders: [],
  selectedOrderNumber: null,
  selectedOrderState: "idle",
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
  selectedOrderDetails: null,
  updateStatus: {
    status: "idle",
    error: null,
    successMessage: null,
  },
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetCancelOrderState: (state) => {
      state.selectedOrderNumber = null;
      state.selectedOrderState = "idle";
      state.error = null;
      state.successMessage = null;
    },
    resetUpdateOrderStatusState: (state) => {
      state.updateStatus.status = "idle"
      state.updateStatus.error = null
      state.updateStatus.successMessage = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fech Orders
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = LoadingState.Loading;
        state.error = action.payload || "Failed to fetch orders";
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state, action) => {
        state.selectedOrderNumber = action.meta.arg.order_id;
        state.selectedOrderState = "cancelling";
      })
      .addCase(
        cancelOrder.fulfilled,
        (state, action: PayloadAction<CancelOrderResponse>) => {
          state.selectedOrderNumber = null;
          state.successMessage = action.payload.message;
          state.selectedOrderState = "cancelled";
        }
      )
      .addCase(cancelOrder.rejected, (state, action) => {
        state.selectedOrderState = "error";
        state.error = action.payload || "Failed to cancel order";
      })
      // Order Details
      .addCase(fetchOrderById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.selectedOrderDetails = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<OrderDetails>) => {
          state.status = "succeeded";
          state.selectedOrderDetails = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch order details";
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatus.status = "loading";
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.updateStatus.status = "succeeded";
          state.updateStatus.successMessage = action.payload;
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatus.status = "failed";
        state.updateStatus.error = action.error.message ?? "Failed to update status";
      });
  },
});

export const { resetCancelOrderState, resetUpdateOrderStatusState } = orderSlice.actions;

export default orderSlice.reducer;
