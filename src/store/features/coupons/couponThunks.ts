import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { CreateCouponRequest } from "./requests/CreateCouponRequest";
import { ApiError } from "../../../types/ApiError";
import { Coupon } from "./couponTypes";

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
  string,
  CreateCouponRequest,
  { rejectValue: string }
>("marketting/createCoupon", async (couponData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/coupons", couponData);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create coupon"
    );
  }
});
