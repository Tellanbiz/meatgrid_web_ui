import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { OperationState, Order } from "./orderTypes";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { cancelOrder, fetchOrders } from "./orderThunks";
import { CancelOrderResponse } from "./request/response/CancelOrderRespons";

interface OrderState {
  orders: Order[];
  selectedOrderNumber: string | null;
  selectedOrderState: OperationState;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrderNumber: null,
  selectedOrderState: "idle",
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default orderSlice.reducer;
