import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { CorporateProduct } from "./corporateProductTypes";

export const fetchCorporateProducts = createAsyncThunk<
  CorporateProduct[],
  void,
  { rejectValue: string }
>("products/fetchCorporateProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/products/org");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch corporate products"
    );
  }
});
