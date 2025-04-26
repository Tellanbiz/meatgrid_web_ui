import { LoadingState } from "../../../types/LoadingStatus";
import { RootState } from "../../store";

export const selectPaymentMethods = (state: RootState) =>
  state.paymentMethods.paymentMethods;
export const selectPaymentMethodStatus = (state: RootState) =>
  state.paymentMethods.status;
export const selectPaymentMethodError = (state: RootState) =>
  state.paymentMethods.error;
export const selectPaymentMethodSuccessMessage = (state: RootState) =>
  state.paymentMethods.successMessage;
export const selectCurrentOperation = (state: RootState) =>
  state.paymentMethods.currentOperation;

export const selectIsFetchingPaymentMethods = (state: RootState) =>
  state.paymentMethods.status === LoadingState.Loading &&
  state.paymentMethods.currentOperation === "fetch";
