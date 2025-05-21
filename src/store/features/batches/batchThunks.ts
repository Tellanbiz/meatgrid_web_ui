import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Batch } from "./batchTypes";
import { ApiError } from "../../../types/ApiError";

export const fetchBatches = createAsyncThunk<
  Batch[],
  void,
  { rejectValue: string }
>("batches/fetchBatches", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/stocks/batches");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch batches"
    );
  }
});
