import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { StoreProduct } from "./storeProductTypes";
import { FetchStoreProductsRequest } from "./requests/FetchStoreProductsRequest";
import { UpdateStoreProductRequest } from "./requests/UpdateStoreProductRequest";

export const fetchStoreProducts = createAsyncThunk<
  StoreProduct[],
  FetchStoreProductsRequest,
  { rejectValue: string }
>("products/fetchStoreProducts", async (fetchParams, { rejectWithValue }) => {
  try {
    const response = await axios.get("/products/store", {
      params: fetchParams,
    });

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch store products"
    );
  }
});

export const updateStoreProduct = createAsyncThunk<
  string,
  UpdateStoreProductRequest,
  { rejectValue: string }
>("products/updateStoreProduct", async (updateParams, { rejectWithValue }) => {
  try {
    const response = await axios.post("/products/store", updateParams);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update store product"
    );
  }
});
