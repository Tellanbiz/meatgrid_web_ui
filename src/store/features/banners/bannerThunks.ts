import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Banner } from "./bannerTypes";
import { CreateBannerRequest } from "./request/CreateBannerRequest";
import { UpdateBannerRequest } from "./request/UpdateBannerRequest";
import { ApiError } from "../../../types/ApiError";
import { ToggleBannerActiveRequest } from "./request/ToggleBannerActive";
import { RootState } from "../../store";

export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>("banners/fetchBanners", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/marketing/banners");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch banners"
    );
  }
});

export const createBanner = createAsyncThunk<
  string,
  CreateBannerRequest,
  { rejectValue: string }
>("banners/createBanner", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/banners", payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create banner"
    );
  }
});

export const updateBanner = createAsyncThunk<
  string,
  UpdateBannerRequest,
  { rejectValue: string }
>("banners/updateBanner", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/marketing/banners`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update banner"
    );
  }
});

export const toggleBannerActive = createAsyncThunk<
  void,
  ToggleBannerActiveRequest,
  { state: RootState }
>("banners/toggleBannerActive", async (payload, { getState, dispatch }) => {
  const state = getState();
  const banner = state.banners.banners.find(
    (banner) => banner.id === payload.id
  );

  if (!banner) {
    throw new Error("Banner not found");
  }

  const updateRequest: UpdateBannerRequest = {
    ...banner,
    active: payload.active,
  };

  await dispatch(updateBanner(updateRequest));
});

export const deleteBanner = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("banners/deleteBanner", async (bannerId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/marketing/banners?id=${bannerId}`);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete banner"
    );
  }
});
