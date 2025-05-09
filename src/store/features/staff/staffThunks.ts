import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Staff } from "./staffTypes";
import { ApiError } from "../../../types/ApiError";
import { UpdateStaffPermissionsRequest } from "./requests/UpdateStaffPermissionsRequest";
import { FetchStaffRequest } from "./requests/FetchStaffRequest";

export const fetchStaffs = createAsyncThunk<
  Staff[],
  void,
  { rejectValue: string }
>("staff/fetchStaffs", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Staff[]>("/staffs");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch staff members"
    );
  }
});

export const fetchStaff = createAsyncThunk<
  Staff,
  FetchStaffRequest,
  { rejectValue: string }
>("staff/fetchStaff", async (params, { rejectWithValue }) => {
  try {
    const response = await axios.get<Staff>("/staff", { params });
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch staff member"
    );
  }
});

export const updateStaffPermissions = createAsyncThunk<
  string,
  UpdateStaffPermissionsRequest,
  { rejectValue: string }
>("staff/updatePermissions", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/staff/update", payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update staff permissions"
    );
  }
});
