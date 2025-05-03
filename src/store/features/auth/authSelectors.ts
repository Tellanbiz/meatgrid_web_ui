import { RootState } from "../../store";

export const selectAuthUser = (state: RootState) => state.auth.user;

export const selectIsFetchingAdminAccount = (state: RootState) =>
  state.auth.currentOperation === "fetchAdminAccount" &&
  state.auth.status === "loading";

export const selectIsLoggingIn = (state: RootState) =>
  state.auth.currentOperation === "login" && state.auth.status === "loading";

export const selectIsLoggingOut = (state: RootState) =>
  state.auth.currentOperation === "logout" && state.auth.status === "loading";

export const selectLogoutSuccess = (state: RootState) =>
  state.auth.currentOperation === "logout" && state.auth.status === "succeeded";

export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectAuthError = (state: RootState) => state.auth.error;
