import { RootState } from "../../store";

export const selectTags = (state: RootState) => state.tags.tags;

export const selectTagById = (state: RootState, tagId: string) =>
  state.tags.tags.find((tag) => tag.id === tagId);

export const selectIsFetchingTags = (state: RootState) =>
  state.tags.status === "loading" && state.tags.currentOperation === "fetch";

export const selectIsCreatingTag = (state: RootState) =>
  state.tags.status === "loading" && state.tags.currentOperation === "create";

export const selectIsUpdatingTag = (state: RootState) =>
  state.tags.status === "loading" && state.tags.currentOperation === "update";

export const selectIsDeletingTag = (state: RootState) =>
  state.tags.status === "loading" && state.tags.currentOperation === "delete";

export const selectTagError = (state: RootState) => state.tags.error;

export const selectTagSuccessMessage = (state: RootState) =>
  state.tags.successMessage;

export const selectTagStatus = (state: RootState) => state.tags.status;
