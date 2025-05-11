import { RootState } from "../../store";

export const selectOrders = (state: RootState) => state.orders.orders;

export const selectOrderStatus = (state: RootState) => state.orders.status;

export const selectOrderError = (state: RootState) => state.orders.error;

export const selectOrderSuccessMessage = (state: RootState) =>
  state.orders.successMessage;

export const selectIsCancellingOrder = (state: RootState) =>
  state.orders.status === "loading" &&
  state.orders.currentOperation === "cancel";

export const selectIsFetchingOrders = (state: RootState) =>
  state.orders.status === "loading" &&
  state.orders.currentOperation === "fetch";

export const selectSelectedOrderNumber = (state: RootState) =>
  state.orders.selectedOrderNumber;

export const selectSelectedOrderState = (state: RootState) =>
  state.orders.selectedOrderState;

export const selectSelectedOrderDetails = (state: RootState) =>
  state.orders.selectedOrderDetails;

export const selectUpdateOrderStatus = (state: RootState) =>
  state.orders.updateStatus.status;

export const selectUpdateOrderError = (state: RootState) =>
  state.orders.updateStatus.error;

export const selectUpdateOrderSuccessMessage = (state: RootState) =>
  state.orders.updateStatus.successMessage;
