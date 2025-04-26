import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import {
  createPaymentMethod,
  fetchPaymentMethods,
  updatePaymentMethod,
} from "./paymentMethodThunks";
import { PaymentMethod } from "./paymentMethodTypes";

interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: PaymentMethodState = {
  paymentMethods: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const paymentMethodSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {
    resetPaymentMethodState: (state) => {
      state.status = LoadingState.Idle;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(
        fetchPaymentMethods.fulfilled,
        (state, action: PayloadAction<PaymentMethod[]>) => {
          state.status = LoadingState.Succeeded;
          state.paymentMethods = action.payload;
        }
      )
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch payment methods";
      })
      // Create
      .addCase(createPaymentMethod.pending, (state) => {
        state.currentOperation = "create";
        state.status = LoadingState.Loading;
      })
      .addCase(
        createPaymentMethod.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = LoadingState.Succeeded;
          state.successMessage = action.payload;
        }
      )
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to create payment method";
      })
      // Update
      .addCase(updatePaymentMethod.pending, (state) => {
        state.currentOperation = "update";
        state.status = LoadingState.Loading;
      })
      .addCase(
        updatePaymentMethod.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = LoadingState.Succeeded;
          state.successMessage = action.payload;
        }
      )
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to update payment method";
      });
  },
});
export const { resetPaymentMethodState } = paymentMethodSlice.actions;
export default paymentMethodSlice.reducer;
