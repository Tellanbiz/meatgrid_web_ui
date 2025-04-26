import axios from "../../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { PaymentMethod } from "./paymentMethodTypes";
import { ApiError } from "../../../types/ApiError";
import { CreatePaymentMethodRequest } from "./request/CreatePaymentMethodRequest";
import { UpdatePaymentMethodRequest } from "./request/UpdatePaymentMethodRequest";

export const fetchPaymentMethods = createAsyncThunk<
  PaymentMethod[],
  void,
  { rejectValue: string }
>("paymentMethods/fetchPaymentMethods", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/payment/methods/all");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch payment methods"
    );
  }
});

export const createPaymentMethod = createAsyncThunk<
  string,
  CreatePaymentMethodRequest,
  { rejectValue: string }
>(
  "paymentMethods/createPaymentMethod",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/payment/methods", payload);
      return response.data.message;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.error || "Failed to create payment method"
      );
    }
  }
);

export const updatePaymentMethod = createAsyncThunk<
  string,
  UpdatePaymentMethodRequest,
  { rejectValue: string }
>(
  "paymentMethods/updatePaymentMethod",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/payment/methods`, payload);
      return response.data.message;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.error || "Failed to update payment method"
      );
    }
  }
);
