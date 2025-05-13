import { createSlice } from "@reduxjs/toolkit";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { MonthReport, ProductReport, StoreReport } from "./reportTypes";
import {
  fetchProductsReport,
  fetchStoresReport,
  fetchYearlyReport,
  fetchTopProducts,
} from "./reportThunks";

interface ReportState {
  productReports: ProductReport[];
  storeReports: StoreReport[];
  yearlyReports: MonthReport[];
  topProducts: ProductReport[];
  currentOperation: "productReports" | "storeReports" | "yearlyReports" | "topProducts" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: ReportState = {
  productReports: [],
  storeReports: [],
  yearlyReports: [],
  topProducts: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsReport.pending, (state) => {
        state.currentOperation = "productReports";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(fetchProductsReport.fulfilled, (state, action) => {
        state.status = LoadingState.Succeeded;
        state.productReports = action.payload;
      })
      .addCase(fetchProductsReport.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch reports";
      })
      .addCase(fetchStoresReport.pending, (state) => {
        state.currentOperation = "storeReports";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(fetchStoresReport.fulfilled, (state, action) => {
        state.status = LoadingState.Succeeded;
        state.storeReports = action.payload;
      })
      .addCase(fetchStoresReport.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch reports";
      })
      .addCase(fetchYearlyReport.pending, (state) => {
        state.currentOperation = "yearlyReports";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(fetchYearlyReport.fulfilled, (state, action) => {
        state.status = LoadingState.Succeeded;
        state.yearlyReports = action.payload;
      })
      .addCase(fetchYearlyReport.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch reports";
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.currentOperation = "topProducts";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.status = LoadingState.Succeeded;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch top products";
      });
  },
});

export default reportSlice.reducer;
