import { RootState } from "../../store";

export const selectBatches = (state: RootState) => state.batches.batches;

export const selectBatchById = (state: RootState, batchId: string) =>
  state.batches.batches.find((batch) => batch.id === batchId);

export const selectIsFetchingBatches = (state: RootState) =>
  state.batches.status === "loading" &&
  state.batches.currentOperation === "fetch";

export const selectBatchError = (state: RootState) => state.batches.error;

export const selectBatchSuccessMessage = (state: RootState) =>
  state.batches.successMessage;

export const selectBatchStatus = (state: RootState) => state.batches.status;
