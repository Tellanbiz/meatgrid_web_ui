import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { UserAccount } from "./accountTypes";
import { ApiError } from "../../../types/ApiError";

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
