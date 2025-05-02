import { RootState } from "../../store";

export const selectSuppliers = (state: RootState) => state.suppliers.suppliers;

export const selectIsFetchingSuppliers = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "fetch";

export const selectIsCreatingSupplier = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "create";

export const selectIsUpdatingSupplier = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "update";

export const selectIsDeletingSupplier = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "delete";

export const selectSupplierSuccessMessage = (state: RootState) =>
  state.suppliers.successMessage;

export const selectSupplierError = (state: RootState) => state.suppliers.error;
