import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Coupon } from "../../../types/Coupon";
import { CreateCouponRequest } from "../../../types/CreateCouponRequest";
import { ApiError } from "../../../types/ApiError";

interface CouponsState {
  coupons: Coupon[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CouponsState = {
  coupons: [],
  status: "idle",
  error: null,
};

export const fetchCoupons = createAsyncThunk<
  Coupon[],
  void,
  { rejectValue: string }
>("marketting/fetchCoupons", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/marketing/coupons");
    return response.data as Coupon[];
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch coupons"
    );
  }
});

export const createCoupon = createAsyncThunk<
  Coupon,
  CreateCouponRequest,
  { rejectValue: string }
>("marketting/createCoupon", async (couponData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/coupons", couponData);
    return response.data as Coupon;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create coupon"
    );
  }
});

const couponsSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
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
        state.status = "loading";
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create coupon";
      });
  },
});

export default couponsSlice.reducer;
