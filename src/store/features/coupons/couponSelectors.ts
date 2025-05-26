import { RootState } from "../../store";

export const selectCoupons = (state: RootState) => state.coupons.coupons;

export const selectCouponById = (id: string) => (state: RootState) =>
  state.coupons.coupons.find((coupon) => coupon.id === id);

export const selectIsFetchingCoupons = (state: RootState) =>
  state.coupons.status === "loading" &&
  state.coupons.currentOperation === "fetch";

export const selectIsCreatingCoupon = (state: RootState) =>
  state.coupons.status === "loading" &&
  state.coupons.currentOperation === "create";

export const selectIsUpdatingCoupon = (state: RootState) =>
  state.coupons.status === "loading" &&
  state.coupons.currentOperation === "update";

export const selectIsDeletingCoupon = (state: RootState) =>
  state.coupons.status === "loading" &&
  state.coupons.currentOperation === "delete";

export const selectCouponError = (state: RootState) => state.coupons.error;

export const selectCouponSuccessMessage = (state: RootState) =>
  state.coupons.successMessage;
