import axios from "../../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProcessProductRequest } from "./requests/ProcessProductRequest";
import { ApiError } from "../../../types/ApiError";

export const processProducts = createAsyncThunk<
  string,
  ProcessProductRequest,
  { rejectValue: string }
>("processProducts/processProducts", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/stocks/process", payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to process products"
    );
  }
});
