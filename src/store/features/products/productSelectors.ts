import { RootState } from "../../store";

export const selectProducts = (state: RootState) => state.products.products;

export const selectCorporateProducts = (state: RootState) => state.products.corporateProducts;

export const selectCorporateProductById = (state: RootState, productId: string) => {
  return state.products.corporateProducts.find((product) => product.id === productId) || null;
};

export const selectProductById = (state: RootState, productId: string) => {
  return (
    state.products.products.find((product) => product.id === productId) || null
  );
};

export const selectIsFetchingProducts = (state: RootState) =>
  state.products.status === "loading" &&
  state.products.currentOperation === "fetch";

export const selectIsFetchingCorporateProducts = (state: RootState) =>
  state.products.status === "loading" &&
  state.products.currentOperation === "fetch_corporate";

export const selectIsCreatingProduct = (state: RootState) =>
  state.products.status === "loading" &&
  state.products.currentOperation === "create";

export const selectIsUpdatingProduct = (state: RootState) =>
  state.products.status === "loading" &&
  state.products.currentOperation === "update";

export const selectIsDeletingProduct = (state: RootState) =>
  state.products.status === "loading" &&
  state.products.currentOperation === "delete";

export const selectProductError = (state: RootState) => state.products.error;

export const selectProductSuccessMessage = (state: RootState) =>
  state.products.successMessage;

export const selectProductStatus = (state: RootState) => state.products.status;
