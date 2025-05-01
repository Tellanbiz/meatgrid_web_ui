import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { Product } from "./productTypes";
import { CreateProductRequest } from "./requests/CreateProductRequest";
import { UpdateProductRequest } from "./requests/UpdateProductRequest";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/admin/products");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch products"
    );
  }
});

export const createProduct = createAsyncThunk<
  string,
  CreateProductRequest,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/product", productData);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create product"
    );
  }
});

export const updateProduct = createAsyncThunk<
  string,
  UpdateProductRequest,
  { rejectValue: string }
>("products/updateProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/product", productData);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update product"
    );
  }
});
