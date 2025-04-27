import { RootState } from "../../store";

export const selectSuppliers = (state: RootState) => state.suppliers.suppliers;

export const selectIsCreateSupplierLoading = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "create";
export const selectIsUpdateSupplierLoading = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "update";

export const selectIsFetchingSuppliers = (state: RootState) =>
  state.suppliers.status === "loading" &&
  state.suppliers.currentOperation === "fetch";
