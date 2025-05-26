import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchTags, createTag, updateTag, deleteTag } from "./tagThunks";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { Tag } from "./tagTypes";

interface TagState {
  tags: Tag[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: TagState = {
  tags: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    resetTagState: (state) => {
      state.status = LoadingState.Idle;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tags
      .addCase(fetchTags.pending, (state) => {
        state.status = "loading";
        state.currentOperation = "fetch";
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action: PayloadAction<Tag[]>) => {
        state.status = "succeeded";
        state.tags = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch tags";
      })
      // Create tag
      .addCase(createTag.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
      })
      .addCase(createTag.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create tag";
      })
      // Update tag
      .addCase(updateTag.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
      })
      .addCase(updateTag.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update tag";
      })
      // Delete tag
      .addCase(deleteTag.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.successMessage = action.payload;
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete tag";
      });
  },
});

export const { resetTagState } = tagSlice.actions;
export default tagSlice.reducer;
