import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ImageUploadResponse } from "../../../types/ImageUploadResponse";
import { ApiError } from "../../../types/ApiError";

export const uploadImages = createAsyncThunk<
  string[],
  File[],
  { rejectValue: string }
>("upload/uploadImages", async (files, thunkAPI) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const res = await axios.post<ImageUploadResponse>(
      "/storage/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return res.data.images;
  } catch (err: unknown) {
    const error = err as ApiError;
    return thunkAPI.rejectWithValue(
      error?.response?.data?.error || "Upload failed"
    );
  }
});