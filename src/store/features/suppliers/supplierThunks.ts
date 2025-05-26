import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { ApiError } from "../../../types/ApiError";
import { Supplier } from "./supplierTypes";
import { UpdateSupplierRequest } from "./request/UpdateSupplierRequest";
import { CreateSupplierRequest } from "./request/CreateSupplierRequest";

export const createSupplier = createAsyncThunk<
  string,
  CreateSupplierRequest,
  { rejectValue: string }
>("suppliers/createSupplier", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/suppliers`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create supplier"
    );
  }
});

export const fetchSuppliers = createAsyncThunk<
  Supplier[],
  void,
  { rejectValue: string }
>("suppliers/fetchSuppliers", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/suppliers`);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch suppliers"
    );
  }
});

export const updateSupplier = createAsyncThunk<
  string,
  UpdateSupplierRequest,
  { rejectValue: string }
>("suppliers/updateSupplier", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/suppliers`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update supplier info"
    );
  }
});

export const deleteSupplier = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("suppliers/deleteSupplier", async (supplierId, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`/suppliers/${supplierId}`);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete supplier"
    );
  }
});
