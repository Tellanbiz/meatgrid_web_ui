import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProcessedProduct, RawMaterial } from "./processProductTypes";

interface ProcessProductState {
  suppliers: string[];
  store: string | null; // Single store
  storageType: string | null; // Single storage type
  raw_materials: RawMaterial[];
  processed_products: ProcessedProduct[];
}

const initialState: ProcessProductState = {
  suppliers: [],
  store: null, // Default to null
  storageType: null, // Default to null
  raw_materials: [],
  processed_products: [],
};

const processProductSlice = createSlice({
  name: "processProducts",
  initialState,
  reducers: {
    setSuppliers(state, action: PayloadAction<string[]>) {
      state.suppliers = action.payload;
    },
    setStore(state, action: PayloadAction<string>) {
      state.store = action.payload; // Set a single store
    },
    setStorageType(state, action: PayloadAction<string>) {
      state.storageType = action.payload; // Set a single storage type
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
  },
});

export const {
  setSuppliers,
  setStore,
  setStorageType,
  addRawMaterial,
  addProcessedProduct,
  resetProcessProduct,
} = processProductSlice.actions;

export default processProductSlice.reducer;