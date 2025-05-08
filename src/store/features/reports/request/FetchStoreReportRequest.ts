import { FetchReportRequest } from "./FetchReportRequest";

export interface FetchStoreReportRequest extends FetchReportRequest {
  store_id: string;
}