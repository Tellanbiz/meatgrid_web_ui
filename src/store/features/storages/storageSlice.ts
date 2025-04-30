import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchStorageTypes,
  createStorageType,
  deleteStorageType,
} from "./storageThunks";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { StorageType } from "./storageTypes";

interface StorageState {
  storages: StorageType[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: StorageState = {
  storages: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const storageSlice = createSlice({
  name: "storages",
  initialState,
  reducers: {
    resetStorageState: (state) => {
      state.status = LoadingState.Idle;
      state.currentOperation = null;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Storage Types
      .addCase(fetchStorageTypes.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchStorageTypes.fulfilled,
        (state, action: PayloadAction<StorageType[]>) => {
          state.status = "succeeded";
          state.storages = action.payload;
        }
      )
      .addCase(fetchStorageTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch storage types";
      })

      // Create Storage Type
      .addCase(createStorageType.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
      })
      .addCase(
        createStorageType.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(createStorageType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create storage type";
      })
      .addCase(deleteStorageType.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
      })
      .addCase(
        deleteStorageType.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(deleteStorageType.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete storage type";
      });
  },
});

export const { resetStorageState } = storageSlice.actions;
export default storageSlice.reducer;
