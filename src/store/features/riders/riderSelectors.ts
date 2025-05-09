import { RootState } from "../../store";

export const selectRiders = (state: RootState) => state.riders.riders;

export const selectRiderById = (state: RootState, riderId: string) =>
  state.riders.riders.find((rider) => rider.id === riderId);

export const selectIsFetchingRiders = (state: RootState) =>
  state.riders.status === "loading" &&
  state.riders.currentOperation === "fetch";

export const selectIsVerifyingRider = (state: RootState) =>
  state.riders.status === "loading" &&
  state.riders.currentOperation === "verify";

export const selectRiderError = (state: RootState) => state.riders.error;

export const selectRiderSuccessMessage = (state: RootState) =>
  state.riders.successMessage;

export const selectVerifiedRiders = (state: RootState) =>
  state.riders.riders.filter((rider) => rider.verified);

export const selectUnverifiedRiders = (state: RootState) =>
  state.riders.riders.filter((rider) => !rider.verified);
