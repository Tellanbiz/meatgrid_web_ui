import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { StorageType } from "./storageTypes";
import { ApiError } from "../../../types/ApiError";
import { CreateStorageRequest } from "./request/CreateStorageRequest";
import { UpdateStorageRequest } from "./request/UpdateStorageRequest";

export const fetchStorageTypes = createAsyncThunk<
  StorageType[],
  void,
  { rejectValue: string }
>("storages/fetchStorageTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/storagetypes");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch storage types"
    );
  }
});

export const createStorageType = createAsyncThunk<
  string,
  CreateStorageRequest,
  { rejectValue: string }
>("storages/createStorageType", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/storagetypes", payload);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create storage type"
    );
  }
});

export const updateStorageType = createAsyncThunk<
  string,
  UpdateStorageRequest,
  { rejectValue: string }
>("storages/updateStorageType", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/storagetypes`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update storage type"
    );
  }
});

export const deleteStorageType = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("storages/deleteStorageType", async (storageTypeId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(
      `/inventory/storagetypes/${storageTypeId}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete storage type"
    );
  }
});
