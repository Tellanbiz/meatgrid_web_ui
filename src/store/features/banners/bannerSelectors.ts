import { RootState } from "../../store";

export const selectBanners = (state: RootState) => state.banners.banners;

export const selectBannerById = (state: RootState, id: string) =>
  state.banners.banners.find((banner) => banner.id === id);

export const selectIsFetchingBanners = (state: RootState) =>
  state.banners.status === "loading" &&
  state.banners.currentOperation === "fetch";

export const selectIsCreatingBanner = (state: RootState) =>
  state.banners.status === "loading" &&
  state.banners.currentOperation === "create";

export const selectIsUpdatingBanner = (state: RootState) =>
  state.banners.status === "loading" &&
  state.banners.currentOperation === "update";

export const selectIsDeletingBanner = (state: RootState) =>
  state.banners.status === "loading" &&
  state.banners.currentOperation === "delete";

export const selectBannerError = (state: RootState) => state.banners.error;

export const selectBannerSuccessMessage = (state: RootState) =>
  state.banners.successMessage;
