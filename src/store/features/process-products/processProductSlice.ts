import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProcessedProduct, RawMaterial } from "./processProductTypes";
import { LoadingStatus } from "../../../types/LoadingStatus";
import { processProducts } from "./processProductThunks";

interface ProcessProductState {
  suppliers: string[];
  store: string | null;
  storageType: string | null;
  raw_materials: RawMaterial[];
  processed_products: ProcessedProduct[];
  currentOperation: "create" | "update" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProcessProductState = {
  suppliers: [],
  store: null,
  storageType: null,
  raw_materials: [],
  processed_products: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const processProductSlice = createSlice({
  name: "processProducts",
  initialState,
  reducers: {
    setSuppliers(state, action: PayloadAction<string[]>) {
      state.suppliers = action.payload;
    },
    setStore(state, action: PayloadAction<string>) {
      state.store = action.payload;
    },
    setStorageType(state, action: PayloadAction<string>) {
      state.storageType = action.payload;
    },
    addRawMaterial(state, action: PayloadAction<RawMaterial>) {
      state.raw_materials.push(action.payload);
    },
    addProcessedProduct(state, action: PayloadAction<ProcessedProduct>) {
      state.processed_products.push(action.payload);
    },
    resetProcessProduct(state) {
      state.suppliers = [];
      state.store = null;
      state.storageType = null;
      state.raw_materials = [];
      state.processed_products = [];
    },
    resetProcessProductState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(processProducts.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(processProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
        state.error = null;
      })
      .addCase(processProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to process products";
        state.successMessage = null;
      });
  },
});

export const {
  setSuppliers,
  setStore,
  setStorageType,
  addRawMaterial,
  addProcessedProduct,
  resetProcessProduct,
  resetProcessProductState,
} = processProductSlice.actions;

export default processProductSlice.reducer;
