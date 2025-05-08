import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { UserAccount } from "./accountTypes";
import { ApiError } from "../../../types/ApiError";
import { UpdateUserRoleRequest } from "./requests/UpdateUserRoleRequest";

export const fetchAccounts = createAsyncThunk<
  UserAccount[],
  void,
  { rejectValue: string }
>("accounts/fetchAccounts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<UserAccount[]>("/accounts");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch accounts"
    );
  }
});

export const updateUserRole = createAsyncThunk<
  string,
  UpdateUserRoleRequest,
  { rejectValue: string }
>("accounts/updateUserRole", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/admin/roles`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update user role"
    );
  }
});