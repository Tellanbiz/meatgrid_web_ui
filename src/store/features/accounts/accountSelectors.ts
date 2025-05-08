import { RootState } from "../../store";

export const selectAccounts = (state: RootState) => state.accounts.accounts;

export const selectAccountById = (state: RootState, accountId: string) =>
  state.accounts.accounts.find((account) => account.id === accountId);

export const selectIsFetchingAccounts = (state: RootState) =>
  state.accounts.status === "loading" &&
  state.accounts.currentOperation === "fetch";

export const selectIsUpdatingUserRole = (state: RootState) =>
  state.accounts.status === "loading" &&
  state.accounts.currentOperation === "updateRole";

export const selectAccountError = (state: RootState) => state.accounts.error;

export const selectAccountSuccessMessage = (state: RootState) =>
  state.accounts.successMessage;
