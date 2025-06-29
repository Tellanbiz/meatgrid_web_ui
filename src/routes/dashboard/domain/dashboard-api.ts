import axios from "@/service/api";
import { Order } from "@/store/features/orders/orderTypes";
import {
  ProductReport,
  StoreReport,
  MonthReport,
  FetchReportRequest,
  FetchStoreReportRequest,
  FetchYearlyReportRequest,
  FetchTopStoresRequest,
  FetchProductDailyReportRequest,
  FetchDashboardStatisticsRequest,
  FetchLatestOrdersRequest,
  ProductDailyReport,
  DashboardStatistics,
} from "./models";

// Dashboard Statistics API
export async function fetchDashboardStatistics(params: FetchDashboardStatisticsRequest): Promise<DashboardStatistics> {
  const response = await axios.get<DashboardStatistics>("/reports/overview", { params });
  return response.data;
}

// Product Reports API
export async function fetchProductsReport(params?: FetchReportRequest): Promise<ProductReport[]> {
  const response = await axios.get<ProductReport[]>("/reports/orders/products", { params });
  return response.data;
}

// Store Reports API
export async function fetchStoresReport(params?: FetchStoreReportRequest): Promise<StoreReport[]> {
  const response = await axios.get<StoreReport[]>("/reports/orders/stores", { params });
  return response.data;
}

// Yearly Reports API
export async function fetchYearlyReport(params?: FetchYearlyReportRequest): Promise<MonthReport[]> {
  const response = await axios.get<MonthReport[]>("/reports/orders/annual", { params });
  return response.data;
}

// Top Stores API
export async function fetchTopStores(params?: FetchTopStoresRequest): Promise<StoreReport[]> {
  const response = await axios.get<StoreReport[]>("/reports/orders/stores", { params });
  return response.data;
}

// Product Daily Report API
export async function fetchProductDailyReport(params: FetchProductDailyReportRequest): Promise<ProductDailyReport> {
  const response = await axios.get<ProductDailyReport>("/reports/orders/daily", { params });
  return response.data;
}

// Latest Orders API - uses existing orders endpoint with limit and date range
export async function fetchLatestOrders(params: FetchLatestOrdersRequest): Promise<Order[]> {
  const response = await axios.get<Order[]>("/admin/orders", {
    params: { 
      ...params,
      sort_by: "created_at",
      sort_order: "desc"
    },
  });
  return response.data;
} 