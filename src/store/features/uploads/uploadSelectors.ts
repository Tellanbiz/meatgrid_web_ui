import { RootState } from "../../store";

export const selectUploadedImages = (state: RootState): string[] =>
  state.uploads.images;

export const selectUploadStatus = (
  state: RootState
): "idle" | "loading" | "succeeded" | "failed" => state.uploads.status;

export const selectUploadError = (state: RootState): string | null =>
  state.uploads.error;
