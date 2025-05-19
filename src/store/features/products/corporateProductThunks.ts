import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { CorporateProduct } from "./corporateProductTypes";
import { FetchCorporateProductsRequest } from "./requests/FetchCorporateProductsRequest";
import { UpdateCorporateProductRequest } from "./requests/UpdateCorporateProductRequest";

export const fetchCorporateProducts = createAsyncThunk<
  CorporateProduct[],
  FetchCorporateProductsRequest | undefined,
  { rejectValue: string }
>(
  "products/fetchCorporateProducts",
  async (fetchParams, { rejectWithValue }) => {
    try {
      const response = await axios.get("/products/org", {
        params: fetchParams,
      });
      
      // Verify that we received an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error("Expected array of products but got:", response.data);
        return rejectWithValue("Invalid response format from server");
      }
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch corporate products"
      );
    }
  }
);

export const updateCorporateProduct = createAsyncThunk<
  string | { message: string } | unknown,  // Updated to handle different response formats
  UpdateCorporateProductRequest,
  { rejectValue: string }
>(
  "products/updateCorporateProduct",
  async (updateParams, { rejectWithValue }) => {
    try {
      const response = await axios.post("/products/org", updateParams);
      return response.data;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.error || "Failed to update corporate product"
      );
    }
  }
);
