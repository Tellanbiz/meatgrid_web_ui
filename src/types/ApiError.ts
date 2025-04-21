import { AxiosError } from "axios";

interface ApiErrorResponse {
  error?: string;
}

export type ApiError = AxiosError<ApiErrorResponse>;
