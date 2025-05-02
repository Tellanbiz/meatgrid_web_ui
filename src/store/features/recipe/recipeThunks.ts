import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Recipe, RecipeWithDetails } from "./recipeTypes";
import { ApiError } from "../../../types/ApiError";
import { EditRecipeRequest } from "./requests/EditRecipeReqest";

export const fetchRecipes = createAsyncThunk<
  Recipe[],
  void,
  { rejectValue: string }
>("/marketting/recipes", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/marketing/recipes");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch recipes"
    );
  }
});

export const fetchRecipeById = createAsyncThunk<
  RecipeWithDetails,
  string,
  { rejectValue: string }
>("recipes/fetchRecipeById", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/marketing/recipes/info?id=${id}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch recipe"
    );
  }
});

export const createRecipe = createAsyncThunk<
  Recipe,
  Partial<Recipe>,
  { rejectValue: string }
>("/recipes/createRecipe", async (recipeData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/recipes", recipeData);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create recipe"
    );
  }
});

export const updateRecipe = createAsyncThunk<
  Recipe,
  { id: string; data: EditRecipeRequest },
  { rejectValue: string }
>("/recipes/udateRecipe", async ({ data }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/marketing/recipes/update`, data);
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update recipe"
    );
  }
});

export const deleteRecipe = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("recipes/deleteRecipe", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/marketing/recipes`, { data: { id } });
    return id;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete recipe"
    );
  }
});
