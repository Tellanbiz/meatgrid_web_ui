import { RootState } from "../../store";

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const selectCategoryById = (state: RootState, categoryId: string) => {
  return (
    state.categories.categories.find(
      (category) => category.id === categoryId
    ) || null
  );
};

export const selectIsFetchingCategories = (state: RootState) =>
  state.categories.status === "loading" &&
  state.categories.currentOperation === "fetch";

export const selectIsCreatingCategory = (state: RootState) =>
  state.categories.status === "loading" &&
  state.categories.currentOperation === "create";

export const selectIsUpdatingCategory = (state: RootState) =>
  state.categories.status === "loading" &&
  state.categories.currentOperation === "update";

export const selectIsDeletingCategory = (state: RootState) =>
  state.categories.status === "loading" &&
  state.categories.currentOperation === "delete";

export const selectCategoryError = (state: RootState) => state.categories.error;

export const selectCategorySuccessMessage = (state: RootState) =>
  state.categories.successMessage;

export const selectCategoryStatus = (state: RootState) =>
  state.categories.status;
