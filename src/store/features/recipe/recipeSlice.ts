import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Recipe, RecipeWithDetails } from "./recipeTypes";
import {
  createRecipe,
  deleteRecipe,
  fetchRecipeById,
  fetchRecipes,
  updateRecipe,
} from "./recipeThunks";

interface RecipesState {
  recipes: Recipe[];
  selectedRecipe: RecipeWithDetails | null;
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  deleteStatus: "idle" | "loading" | "succeeded" | "failed";
  deleteError: string | null;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  selectedRecipe: null,
  status: "idle",
  deleteStatus: "idle",
  deleteError: null,
  currentOperation: null,
  error: null,
};

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearSelectedRecipe: (state) => {
      state.selectedRecipe = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state, action: PayloadAction<Recipe[]>) => {
          state.status = "succeeded";
          state.recipes = action.payload;
        }
      )
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch recipes";
      })

      .addCase(fetchRecipeById.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchRecipeById.fulfilled,
        (state, action: PayloadAction<RecipeWithDetails>) => {
          state.status = "succeeded";
          state.selectedRecipe = action.payload;
        }
      )
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch recipe";
      })

      .addCase(createRecipe.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        createRecipe.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          state.recipes.push(action.payload);
          state.status = "succeeded";
        }
      )
      .addCase(createRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create recipe";
      })

      .addCase(updateRecipe.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
      })
      .addCase(
        updateRecipe.fulfilled,
        (state, action: PayloadAction<Recipe>) => {
          const index = state.recipes.findIndex(
            (r) => r.id === action.payload.id
          );
          if (index !== -1) {
            state.recipes[index] = action.payload;
          }
        }
      )
      .addCase(updateRecipe.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error updating recipe";
      })

      .addCase(deleteRecipe.pending, (state) => {
        state.currentOperation = "delete";
        state.deleteStatus = "loading";
        state.deleteError = null;
      })
      .addCase(
        deleteRecipe.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleteStatus = "succeeded";
          state.recipes = state.recipes.filter((r) => r.id !== action.payload);
        }
      )
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.deleteStatus = "failed";
        state.error = action.payload || "Failed to delete recipe";
        state.deleteError = action.payload || "Failed to delete recipe";
      });
  },
});

export const { clearSelectedRecipe } = recipesSlice.actions;

export default recipesSlice.reducer;
