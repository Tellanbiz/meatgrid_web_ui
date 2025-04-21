import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Store } from "./storeTypes";
import { ApiError } from "../../../types/ApiError";

export const fetchStores = createAsyncThunk<
  Store[],
  void,
  { rejectValue: string }
>("stores/fetchStores", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Store[]>("/stores");
    return res.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch stores"
    );
  }
});
