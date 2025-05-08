import { createSlice } from "@reduxjs/toolkit";
import { UserAccount } from "./accountTypes";
import { fetchAccounts } from "./accountThunks";
import { LoadingStatus } from "../../../types/LoadingStatus";

interface AccountState {
  accounts: UserAccount[];
  currentOperation: "fetch" | null;
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
      });
  },
});

export const { resetAccountState } = accountSlice.actions;

export default accountSlice.reducer;
