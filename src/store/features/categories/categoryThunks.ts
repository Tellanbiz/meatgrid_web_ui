import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Category } from "./categoryTypes";
import { CreateCategoryRequest } from "./request/CreateCategoryRequest";
import { UpdateCategoryRequest } from "./request/UpdateCategoryRequest";
import { ApiError } from "../../../types/ApiError";

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/product/categories");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch categories"
    );
  }
});

export const createCategory = createAsyncThunk<
  string,
  CreateCategoryRequest,
  { rejectValue: string }
>("categories/createCategory", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/product/category/submit", payload);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create category"
    );
  }
});

export const updateCategory = createAsyncThunk<
  string,
  UpdateCategoryRequest,
  { rejectValue: string }
>("categories/updateCategory", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/product/category/submit`, payload);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update category"
    );
  }
});

export const deleteCategory = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("categories/deleteCategory", async (categoryId, { rejectWithValue }) => {
  try {
    await axios.delete(`/product/categories/${categoryId}`);
    return categoryId;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete category"
    );
  }
});
