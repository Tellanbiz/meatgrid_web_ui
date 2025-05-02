import { RootState } from "../../store";

export const selectRecipes = (state: RootState) => state.recipes.recipes;

export const selectSelectedRecipe = (state: RootState) =>
  state.recipes.selectedRecipe;

export const selectIsFetchingRecipes = (state: RootState) =>
  state.recipes.status === "loading" &&
  state.recipes.currentOperation === "fetch";

export const selectIsCreatingRecipe = (state: RootState) =>
  state.recipes.status === "loading" &&
  state.recipes.currentOperation === "create";

export const selectIsUpdatingRecipe = (state: RootState) =>
  state.recipes.status === "loading" &&
  state.recipes.currentOperation === "update";

export const selectIsDeletingRecipe = (state: RootState) =>
  state.recipes.status === "loading" &&
  state.recipes.currentOperation === "delete";

export const selectRecipeStatus = (state: RootState) => state.recipes.status;

export const selectRecipeError = (state: RootState) => state.recipes.error;

export const selectDeleteStatus = (state: RootState) =>
  state.recipes.deleteStatus;

export const selectDeleteError = (state: RootState) =>
  state.recipes.deleteError;
