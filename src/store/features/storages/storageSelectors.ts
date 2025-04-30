import { RootState } from "../../store";

export const selectStorageTypes = (state: RootState) => state.storages.storages;

export const selectStorageTypeById = (
  state: RootState,
  storageTypeId: string
) => {
  return (
    state.storages.storages.find(
      (storageType) => storageType.id === storageTypeId
    ) || null
  );
};

export const selectIsFetchingStorageTypes = (state: RootState) =>
  state.storages.status === "loading" &&
  state.storages.currentOperation === "fetch";

export const selectIsCreatingStorageType = (state: RootState) =>
  state.storages.status === "loading" &&
  state.storages.currentOperation === "create";

export const selectStorageError = (state: RootState) => state.storages.error;

export const selectStorageSuccessMessage = (state: RootState) =>
  state.storages.successMessage;

export const selectStorageStatus = (state: RootState) => state.storages.status;
