import { RootState } from "../../store";

export const selectSchedules = (state: RootState) => state.schedules.schedules;

export const selectIsFetchingSchedules = (state: RootState) =>
  state.schedules.currentOperation === "fetch" &&
  state.schedules.status === "loading";

export const selectIsCreatingSchedule = (state: RootState) =>
  state.schedules.currentOperation === "create" &&
  state.schedules.status === "loading";

export const selectIsUpdatingSchedule = (state: RootState) =>
  state.schedules.currentOperation === "update" &&
  state.schedules.status === "loading";

export const selectCreateScheduleSuccess = (state: RootState) =>
  state.schedules.currentOperation === "create" &&
  state.schedules.status === "succeeded";

export const selectUpdateScheduleSuccess = (state: RootState) =>
  state.schedules.currentOperation === "update" &&
  state.schedules.status === "succeeded";

export const selectIsDeletingSchedule = (state: RootState) =>
  state.schedules.currentOperation === "delete" &&
  state.schedules.status === "loading";

export const selectScheduleError = (state: RootState) => state.schedules.error;

export const selectScheduleSuccessMessage = (state: RootState) =>
  state.schedules.successMessage;
