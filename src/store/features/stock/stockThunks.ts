import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Stock } from "./stockTypes";
import { ApiError } from "../../../types/ApiError";

export const fetchStocks = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string }
>("stocks/fetchStocks", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Stock[]>("/stocks");
    return res.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch stocks"
    );
  }
});
