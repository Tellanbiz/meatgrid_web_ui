import { createSlice } from "@reduxjs/toolkit";
import { Rider } from "./riderTypes";
import { fetchRiders, verifyRider } from "./riderThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface RiderState {
  riders: Rider[];
  currentOperation: "fetch" | "verify" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: RiderState = {
  riders: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const riderSlice = createSlice({
  name: "riders",
  initialState,
  reducers: {
    resetRiderState: (state) => {
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
    clearRiderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Riders
      .addCase(fetchRiders.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.riders = action.payload;
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch riders";
      })

      // Verify Rider
      .addCase(verifyRider.pending, (state) => {
        state.currentOperation = "verify";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyRider.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(verifyRider.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to verify rider";
      });
  },
});

export const { resetRiderState, clearRiderMessages } = riderSlice.actions;
export default riderSlice.reducer;