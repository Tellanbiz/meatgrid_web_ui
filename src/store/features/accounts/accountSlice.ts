import { createSlice } from "@reduxjs/toolkit";
import { UserAccount, AdminAccount } from "./accountTypes";
import {
  fetchAccounts,
  updateUserRole,
  fetchAdminAccounts,
  updateAdministratorPermissions,
} from "./accountThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface AccountState {
  accounts: UserAccount[];
  adminAccounts: AdminAccount[];
  currentOperation: "fetch" | "updateRole" | "fetchAdmins" | "updatePermissions" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: AccountState = {
  accounts: [],
  adminAccounts: [],
  currentOperation: null,
  status: "idle",
  error: null,
  successMessage: null,
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    resetAccountState: (state) => {
      state.accounts = [];
      state.adminAccounts = [];
      state.currentOperation = null;
      state.status = "idle";
      state.error = null;
      state.successMessage = null;
    },

    clearAccountMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch accounts";
      })

      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.currentOperation = "updateRole";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update user role";
      })

      // Fetch Admin Accounts
      .addCase(fetchAdminAccounts.pending, (state) => {
        state.currentOperation = "fetchAdmins";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.adminAccounts = action.payload;
      })
      .addCase(fetchAdminAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch admin accounts";
      })

      // Update Administrator Permissions
      .addCase(updateAdministratorPermissions.pending, (state) => {
        state.currentOperation = "updatePermissions";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAdministratorPermissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateAdministratorPermissions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update administrator permissions";
      });
  },
});

export const { resetAccountState, clearAccountMessages } = accountSlice.actions;

export default accountSlice.reducer;
