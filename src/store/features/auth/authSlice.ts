import { createSlice } from "@reduxjs/toolkit";
import { AdminAccount } from "./authTypes";
import { fetchAdminAccount, loginUser, logoutUser } from "./authThunks";

interface AuthState {
  user: AdminAccount | null;
  token?: string;
  currentOperation: "login" | "logout" | "fetchAdminAccount" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  currentOperation: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
    resetStatus(state) {
      state.status = "idle";
      state.error = null;
    },
    resetAuthState(state) {
      state.user = null;
      state.status = "idle";
      state.error = null;
      state.currentOperation = null;
      state.token = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.currentOperation = "login";
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Login failed";
      })
      // Admin Account Details
      .addCase(fetchAdminAccount.pending, (state) => {
        state.currentOperation = "fetchAdminAccount";
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminAccount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchAdminAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch admin account";
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.currentOperation = "logout";
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || "Failed to log out";
      });
  },
});

export const { resetStatus, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
