import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Store } from "./storeTypes";
import { ApiError } from "../../../types/ApiError";
import { CreateStoreRequest } from "./requests/CreateStoreRequest";
import { UpdateStoreRequest } from "./requests/UpdateStoreRequest";

export const fetchStores = createAsyncThunk<
  Store[],
  void,
  { rejectValue: string }
>("stores/fetchStores", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get<Store[]>("/stores");
    return res.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch stores"
    );
  }
});

export const createStore = createAsyncThunk<
  string,
  CreateStoreRequest,
  { rejectValue: string }
>("stores/createStore", async (store, { rejectWithValue }) => {
  try {
    const res = await axios.post("/stores", store);
    return res.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create store"
    );
  }
});

export const updateStore = createAsyncThunk<
  string,
  UpdateStoreRequest,
  { rejectValue: string }
>("stores/updateStore", async (store, { rejectWithValue }) => {
  try {
    const res = await axios.post(`/stores`, store);
    return res.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update store"
    );
  }
});
