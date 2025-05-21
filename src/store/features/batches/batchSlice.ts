import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { Batch } from "./batchTypes";
import { fetchBatches } from "./batchThunks";

interface BatchState {
  batches: Batch[];
  currentOperation: "fetch" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: BatchState = {
  batches: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const batchSlice = createSlice({
  name: "batches",
  initialState,
  reducers: {
    resetBatchState: (state) => {
      state.status = LoadingState.Idle;
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
    clearBatchMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatches.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = LoadingState.Loading;
        state.error = null;
      })
      .addCase(
        fetchBatches.fulfilled,
        (state, action: PayloadAction<Batch[]>) => {
          state.status = LoadingState.Succeeded;
          state.batches = action.payload;
        }
      )
      .addCase(fetchBatches.rejected, (state, action) => {
        state.status = LoadingState.Failed;
        state.error = action.payload || "Failed to fetch batches";
      });
  },
});

export const { resetBatchState, clearBatchMessages } = batchSlice.actions;
export default batchSlice.reducer;
