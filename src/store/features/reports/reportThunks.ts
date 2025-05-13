import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { FetchReportRequest } from "./request/FetchReportRequest";
import { ApiError } from "../../../types/ApiError";
import { MonthReport, ProductReport, StoreReport } from "./reportTypes";
import { FetchStoreReportRequest } from "./request/FetchStoreReportRequest";
import { FetchYearlyReportRequest } from "./request/FetchYearlyReportRequest";
import { FetchTopProductsRequest } from "./request/FetchTopProductsRequest";

export const fetchProductsReport = createAsyncThunk<
  ProductReport[],
  FetchReportRequest,
  { rejectValue: string }
>("reports/fetchMonthlyOrderProducts", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/reports/orders/products`, {
      params: payload,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch monthly order products"
    );
  }
});

export const fetchStoresReport = createAsyncThunk<
  StoreReport[],
  FetchStoreReportRequest,
  { rejectValue: string }
>("reports/fetchMonthlyOrderStores", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/reports/orders/stores`, {
      params: payload,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch monthly order stores"
    );
  }
});

export const fetchYearlyReport = createAsyncThunk<
  MonthReport[],
  FetchYearlyReportRequest,
  { rejectValue: string }
>("reports/fetchYearlyReport", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/reports/orders/annual`, {
      params: payload,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch yearly report"
    );
  }
});

export const fetchTopProducts = createAsyncThunk<
  ProductReport[],
  FetchTopProductsRequest,
  { rejectValue: string }
>("reports/fetchTopProducts", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/reports/orders/products`, {
      params: payload,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch top products"
    );
  }
});


