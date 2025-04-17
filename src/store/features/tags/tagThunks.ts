import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { CreateTagRequest } from "./request/CreateTagRequest";
import { UpdateTagRequest } from "./request/UdateTagRequest";
import { Tag } from "./tagTypes";

export const fetchTags = createAsyncThunk<Tag[], void, { rejectValue: string }>(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Tag[]>("/marketing/tags/all");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Error fetching tags"
      );
    }
  }
);

export const createTag = createAsyncThunk<
  string,
  CreateTagRequest,
  { rejectValue: string }
>("tags/createTag", async (tagData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/tags", tagData);
    return response.data.message || "Tag created successfully";
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Error creating tag");
  }
});

export const updateTag = createAsyncThunk<
  string,
  UpdateTagRequest,
  { rejectValue: string }
>("tags/updateTag", async (tagData, { rejectWithValue }) => {
  try {
    const response = await axios.post("/marketing/tags", tagData);
    return response.data.message || "Tag updated successfully";
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || "Error updating tag");
  }
});
