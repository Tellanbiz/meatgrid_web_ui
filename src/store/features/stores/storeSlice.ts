import { createSlice } from "@reduxjs/toolkit";
import { fetchStores, updateStore } from "./storeThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";
import { Store } from "./storeTypes";

interface StoresState {
  stores: Store[];
  currentOperation: "create" | "fetch" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: StoresState = {
  stores: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const storeSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    resetStoreState: (state) => {
      state.currentOperation = null;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })
      // Update
      .addCase(updateStore.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { resetStoreState } = storeSlice.actions;
export default storeSlice.reducer;
