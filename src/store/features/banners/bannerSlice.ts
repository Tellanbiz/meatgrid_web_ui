import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "./bannerThunks";
import { LoadingState, LoadingStatus } from "../../../types/LoadingStatus";
import { Banner } from "./bannerTypes";

interface BannerState {
  banners: Banner[];
  currentOperation: "fetch" | "create" | "update" | "delete" | null;
  status: LoadingStatus;
  error: string | null;
  successMessage: string | null;
}

const initialState: BannerState = {
  banners: [],
  currentOperation: null,
  status: LoadingState.Idle,
  error: null,
  successMessage: null,
};

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    resetBannerState: (state) => {
      state.status = LoadingState.Idle;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBanners.pending, (state) => {
        state.currentOperation = "fetch";
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchBanners.fulfilled,
        (state, action: PayloadAction<Banner[]>) => {
          state.status = "succeeded";
          state.banners = action.payload;
        }
      )
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch banners";
      })

      // Create
      .addCase(createBanner.pending, (state) => {
        state.currentOperation = "create";
        state.status = "loading";
      })
      .addCase(
        createBanner.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(createBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to create banner";
      })

      // Update
      .addCase(updateBanner.pending, (state) => {
        state.currentOperation = "update";
        state.status = "loading";
      })
      .addCase(
        updateBanner.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.successMessage = action.payload;
        }
      )
      .addCase(updateBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update banner";
      })

      // Delete
      .addCase(deleteBanner.pending, (state) => {
        state.currentOperation = "delete";
        state.status = "loading";
      })
      .addCase(
        deleteBanner.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.banners = state.banners.filter(
            (banner) => banner.id !== action.payload
          );
          state.successMessage = "Banner deleted successfully";
        }
      )
      .addCase(deleteBanner.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete banner";
      });
  },
});

export const { resetBannerState } = bannerSlice.actions;
export default bannerSlice.reducer;
