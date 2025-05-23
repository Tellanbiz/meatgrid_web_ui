import { createSlice } from "@reduxjs/toolkit";
import { Schedule } from "./scheduleTypes";
import {
  createSchedule,
  deleteSchedule,
  fetchSchedules,
  updateSchedule,
} from "./scheduleThunks";

interface ScheduleState {
  schedules: Schedule[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  successMessage: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const scheduleSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    resetScheduleState: (state) => {
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
      state.currentOperation = null;
    },
    clearScheduleMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchSchedules.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch schedules";
      })

      // Create
      .addCase(createSchedule.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
        state.error = null;
      })
      .addCase(createSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(createSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create schedule";
      })

      // Update
      .addCase(updateSchedule.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update schedule";
      })

      // Delete
      .addCase(deleteSchedule.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteSchedule.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.schedules = state.schedules.filter(
          (schedule) => schedule.id !== action.payload
        );
        state.successMessage = "Schedule deleted successfully";
      })
      .addCase(deleteSchedule.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete schedule";
      });
  },
});

export const { resetScheduleState, clearScheduleMessages } =
  scheduleSlice.actions;

export default scheduleSlice.reducer;
