import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Stock } from "./stockTypes";
import { ApiError } from "../../../types/ApiError";
import { UpdateStockQuantityRequest } from "./request/UpdateStockQuantityRequest";
import { TransferStockRequest } from "./request/TransferStockRequest";
import { RestockInventoryRequest } from "./request/RestockInventoryRequest";

export const fetchStocks = createAsyncThunk<
  Stock[],
  void,
  { rejectValue: string }
>("stock/fetchStocks", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/stocks");
    const stocks = response.data;

    return stocks.map((stock: Stock) => {
      const isKilogramUnit =
        stock.product.unit_type === "kilograms" ||
        stock.product.unit_type === "kilogram";

      if (isKilogramUnit) {
        return {
          ...stock,
          quantity: stock.quantity / 1000,
        };
      }

      return stock;
    });
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch stocks"
    );
  }
});

export const updateStockQuantity = createAsyncThunk<
  string,
  UpdateStockQuantityRequest,
  { rejectValue: string }
>("stocks/updateStockQuantity", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/stocks/update`, data);
    return res.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update stock quantity"
    );
  }
});

export const transferStock = createAsyncThunk<
  string,
  TransferStockRequest,
  { rejectValue: string }
>("stores/transferStock", async (transferRequest, { rejectWithValue }) => {
  try {
    const res = await axios.post("/stocks/transfer", transferRequest);
    return res.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to transfer stock"
    );
  }
});

export const restockInventory = createAsyncThunk<
  string,
  RestockInventoryRequest,
  { rejectValue: string }
>("stocks/restockInventory", async (restockRequest, { rejectWithValue }) => {
  try {
    const res = await axios.post("/stocks/receive", restockRequest);
    return res.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to restock inventory"
    );
  }
});
