import { createSlice } from "@reduxjs/toolkit";
import { uploadImages } from "./uploadThunks";

interface UploadState {
  images: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UploadState = {
  images: [],
  status: "idle",
  error: null,
};

const uploadSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    resetUploadState: (state) => {
      state.images = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.images = action.payload;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Upload failed";
      });
  },
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice.reducer;
