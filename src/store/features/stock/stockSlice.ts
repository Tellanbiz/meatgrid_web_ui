import { createSlice } from "@reduxjs/toolkit";
import {
  fetchStocks,
  restockInventory,
  transferStock,
  updateStockQuantity,
} from "./stockThunks";
import { Stock } from "./stockTypes";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface StocksState {
  stocks: Stock[];
  currentOperation:
    | "create"
    | "fetch"
    | "update"
    | "delete"
    | "transferStock"
    | "restockInventory"
    | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: StocksState = {
  stocks: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stocks = action.payload;
      })
      .addCase(fetchStocks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(updateStockQuantity.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStockQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateStockQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(transferStock.pending, (state) => {
        state.currentOperation = "transferStock";
        state.status = "loading";
        state.error = null;
      })
      .addCase(transferStock.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(transferStock.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(restockInventory.pending, (state) => {
        state.currentOperation = "restockInventory";
        state.status = "loading";
        state.error = null;
      })
      .addCase(restockInventory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(restockInventory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export default stockSlice.reducer;
