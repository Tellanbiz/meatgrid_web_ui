import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingStatus } from "../../../types/LoadingStatus";
import { Supplier } from "./supplierTypes";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
} from "./supplierThunks";

interface SupplierState {
  suppliers: Supplier[];
  status: LoadingStatus;
  currentOperation: "create" | "fetch" | "update" | "delete" | null;
  error: string | null;
  successMessage: string | null;
}

const initialState: SupplierState = {
  suppliers: [],
  status: "idle",
  currentOperation: null,
  error: null,
  successMessage: null,
};

const storeSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    resetSupplierState: (state) => {
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSupplier.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createSupplier.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(createSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(fetchSuppliers.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(updateSupplier.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      .addCase(deleteSupplier.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { resetSupplierState } = storeSlice.actions;
export default storeSlice.reducer;
