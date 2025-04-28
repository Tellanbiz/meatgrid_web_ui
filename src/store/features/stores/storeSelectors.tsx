import { RootState } from "../../store";

export const selectStores = (state: RootState) => state.stores.stores;

export const selectStoreById = (state: RootState, storeId: string) =>
  state.stores.stores.find((store) => store.id === storeId);

export const selectIsCreateStoreLoading = (state: RootState) =>
  state.stores.status === "loading" &&
  state.stores.currentOperation === "create";

export const selectIsUpdateStoreLoading = (state: RootState) =>
  state.stores.status === "loading" &&
  state.stores.currentOperation === "update";

export const selectIsFetchingStores = (state: RootState) =>
  state.stores.status === "loading" &&
  state.stores.currentOperation === "fetch";

export const selectIsDeletingStoreLoading = (state: RootState) =>
  state.stores.status === "loading" &&
  state.stores.currentOperation === "delete";

export const selectStoreError = (state: RootState) => state.stores.error;

export const selectStoreStatus = (state: RootState) => state.stores.status;

export const selectCurrentOperation = (state: RootState) =>
  state.stores.currentOperation;

export const selectStoreSuccessMessage = (state: RootState) =>
  state.stores.successMessage;
