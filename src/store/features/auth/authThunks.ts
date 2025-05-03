import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { AdminAccount } from "./authTypes";

export const loginUser = createAsyncThunk<
  string,
  { value: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post("/auth/signin", credentials);

    const { token } = response.data;
    localStorage.setItem("token", token);

    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(error.response?.data?.error || "Login failed");
  }
});

export const fetchAdminAccount = createAsyncThunk<
  AdminAccount,
  void,
  { rejectValue: string }
>("auth/fetchAdminAccount", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/admin/my");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch admin account"
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("token");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    } catch (err: unknown) {
      const error = err as ApiError;
      return rejectWithValue(
        error.response?.data?.error || "Failed to log out"
      );
    }
  }
);
