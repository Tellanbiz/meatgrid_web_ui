import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { Rider } from "./riderTypes";
import { VerifyRiderRequest } from "./requests/VerifyRiderRequest";

export const fetchRiders = createAsyncThunk<
  Rider[],
  void,
  { rejectValue: string }
>("riders/fetchRiders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Rider[]>("/riders");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch riders"
    );
  }
});

export const verifyRider = createAsyncThunk<
  string,
  VerifyRiderRequest,
  { rejectValue: string }
>("riders/verifyRider", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/rider/verify", payload);
    return (
      response.data.message || "Rider verification status updated successfully"
    );
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error ||
        "Failed to update rider verification status"
    );
  }
});
