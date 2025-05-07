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
