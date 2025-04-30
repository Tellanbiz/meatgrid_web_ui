import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Coupon } from "./couponTypes";
import { createCoupon, fetchCoupons } from "./couponThunks";

interface CouponsState {
  coupons: Coupon[];
  currentOperation: "create" | "fetch" | "read" | "update" | "delete" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: CouponsState = {
  coupons: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    resetCouponsState: (state) => {
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCoupons.fulfilled,
        (state, action: PayloadAction<Coupon[]>) => {
          state.status = "succeeded";
          state.coupons = action.payload;
        }
      )
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch coupons";
      })
      // create coupons
      .addCase(createCoupon.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create coupon";
      });
  },
});

export const { resetCouponsState } = couponsSlice.actions;
export default couponsSlice.reducer;
