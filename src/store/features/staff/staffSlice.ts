import { createSlice } from "@reduxjs/toolkit";
import { Staff } from "./staffTypes";
import { fetchStaff, fetchStaffs, updateStaffPermissions } from "./staffThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface StaffState {
  staffs: Staff[];
  currentStaff: Staff | null;
  currentOperation: "fetch" | "staffInfo" | "updatePermissions" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: StaffState = {
  staffs: [],
  currentStaff: null,
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    resetStaffState: (state) => {
      state.staffs = [];
      state.currentOperation = null;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },
    clearStaffMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Staffs
      .addCase(fetchStaffs.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStaffs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.staffs = action.payload;
      })
      .addCase(fetchStaffs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch staff members";
      })

      // Update Staff Permissions
      .addCase(updateStaffPermissions.pending, (state) => {
        state.currentOperation = "updatePermissions";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateStaffPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage =
          action.payload || "Staff permissions updated successfully";
      })
      .addCase(updateStaffPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update staff permissions";
      })
      .addCase(fetchStaff.pending, (state) => {
        state.currentOperation = "staffInfo";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentStaff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch staff member";
      });
  },
});

export const { resetStaffState, clearStaffMessages } = staffSlice.actions;

export default staffSlice.reducer;
