import { createSlice } from "@reduxjs/toolkit";
import { UserAccount } from "./accountTypes";
import { fetchAccounts, updateUserRole } from "./accountThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface AccountState {
  accounts: UserAccount[];
  currentOperation: "fetch" | "updateRole" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: AccountState = {
  accounts: [],
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
      });
  },
});

export const { resetAccountState, clearAccountMessages } = accountSlice.actions;

export default accountSlice.reducer;
