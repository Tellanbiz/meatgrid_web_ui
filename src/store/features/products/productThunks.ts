import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { Product } from "./productTypes";
import { CreateProductRequest } from "./requests/CreateProductRequest";
import { UpdateProductRequest } from "./requests/UpdateProductRequest";
import { FetchProductsRequest } from "./requests/FetchProductsRequest";

export const fetchProducts = createAsyncThunk<
  Product[],
  FetchProductsRequest | undefined,
  { rejectValue: string }
>("products/fetchProducts", async (fetchParams, { rejectWithValue }) => {
  try {
    const response = await axios.get("/admin/products", {
      params: fetchParams,
    });

    // Transform products with unit_type "kilograms" to convert stock values from grams to kg
    const transformedProducts = response.data.map((product: Product) => {
      if (
        product.unit_type === "kilograms" ||
        product.unit_type === "kilogram"
      ) {
        return {
          ...product,
          stock_info: {
            total_instock: product.stock_info.total_instock / 1000,
            total_reclaim: product.stock_info.total_reclaim / 1000,
            total_correction: product.stock_info.total_correction / 1000,
            total_damaged: product.stock_info.total_damaged / 1000,
            total_migrated: product.stock_info.total_migrated / 1000,
            total_processed: product.stock_info.total_processed / 1000,
            total_sold: product.stock_info.total_sold / 1000,
          },
        };
      }
      return product;
    });

    return transformedProducts;
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
