import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryThunks";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { Category } from "./categoryTypes";

interface CategoryState {
  categories: Category[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: CategoryState = {
  categories: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.status = LoadingState.Idle;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCategories.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch categories";
      })

      // Create
      .addCase(createCategory.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
      })
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create category";
      })

      // Update
      .addCase(updateCategory.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
      })
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update category";
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
      })
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.categories = state.categories.filter(
            (cat) => cat.id !== action.payload
          );
          state.successMessage = "Category deleted successfully";
        }
      )
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { resetCategoryState } = categorySlice.actions;
export default categorySlice.reducer;
