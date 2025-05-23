import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../service/api";
import { Schedule } from "./scheduleTypes";
import { ApiError } from "../../../types/ApiError";
import { CreateScheduleRequest } from "./requests/CreateScheduleRequest";
import { UpdateScheduleRequest } from "./requests/UpdateScheduleRequest";

export const fetchSchedules = createAsyncThunk<
  Schedule[],
  void,
  { rejectValue: string }
>("schedules/fetchSchedules", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get("/configuration/schedules");
    return response.data;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to fetch schedules"
    );
  }
});

export const createSchedule = createAsyncThunk<
  string,
  CreateScheduleRequest,
  { rejectValue: string }
>("schedules/createSchedule", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post("/configuration/schedules", payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to create schedule"
    );
  }
});

export const updateSchedule = createAsyncThunk<
  string,
  UpdateScheduleRequest,
  { rejectValue: string }
>("schedules/updateSchedule", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`/configuration/schedules`, payload);
    return response.data.message;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to update schedule"
    );
  }
});

export const deleteSchedule = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("schedules/deleteSchedule", async (scheduleId, { rejectWithValue }) => {
  try {
    await axios.delete(`/configuration/schedules/${scheduleId}`);
    return scheduleId;
  } catch (err: unknown) {
    const error = err as ApiError;
    return rejectWithValue(
      error.response?.data?.error || "Failed to delete schedule"
    );
  }
});
