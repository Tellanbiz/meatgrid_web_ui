import { RootState } from "../../store";

export const selectSuppliers = (state: RootState) =>
  state.processProducts.suppliers;

export const selectStore = (state: RootState) => state.processProducts.store;

export const selectStorageType = (state: RootState) =>
  state.processProducts.storageType;

export const selectRawMaterials = (state: RootState) =>
  state.processProducts.raw_materials;

export const selectProcessedProducts = (state: RootState) =>
  state.processProducts.processed_products;

export const selectIsProcesssingProducts = (state: RootState) =>
  state.processProducts.status === "loading" &&
  state.processProducts.currentOperation === "create";

export const selectProcessProductError = (state: RootState) =>
  state.processProducts.error;

export const selectProcessProductSuccessMessage = (state: RootState) =>
  state.processProducts.successMessage;
