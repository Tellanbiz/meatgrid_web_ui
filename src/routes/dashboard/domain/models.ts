import { Order } from "@/store/features/orders/orderTypes";

export interface ProductReport {
  product_id: string;
  images: string;
  name: string;
  regular_price: number;
  unit_type: string;
  order_count: number;
  total_revenue: number;
}

export interface StoreReport {
  store_id: string;
  store_name: string;
  total_revenue: number;
  order_count: number;
}

export interface MonthReport {
  month_name: string;
  monthly_revenue: number;
  order_count: number;
}

export interface FetchReportRequest {
  month?: number;
  year?: number;
  start_date?: string; // yyyy-mm-dd format
  end_date?: string; // yyyy-mm-dd format
}

export interface FetchStoreReportRequest {
  month?: number;
  year?: number;
  store_id?: string;
}

export interface FetchYearlyReportRequest {
  year?: number;
}

export interface FetchTopProductsRequest {
  limit?: number;
  month?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
}

export interface FetchTopStoresRequest {
  limit?: number;
  month?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
}

export interface FetchProductDailyReportRequest {
  start_date: string; // yyyy-mm-dd format
  end_date: string; // yyyy-mm-dd format
  product_id: string;
}

export interface DailyRevenue {
  date: string; // dd-mm-yyyy format
  order_count: number;
  revenue: number;
}

export interface ProductDailyReport {
  id: string;
  product_name: string;
  start_date: string;
  end_date: string;
  revenues: DailyRevenue[];
}

export interface FetchLatestOrdersRequest {
  start_date: string; // yyyy-mm-dd format
  end_date: string; // yyyy-mm-dd format
  limit?: number;
}

export interface FetchDashboardStatisticsRequest {
  start_date: string; // yyyy-mm-dd format
  end_date: string; // yyyy-mm-dd format
}

export interface OrderStatusCounts {
  dispatch: number;
  delivered: number;
  preparing: number;
}

export interface DashboardStatistics {
  total_users: number;
  total_products: number;
  total_revenue: number;
  order_status_counts: OrderStatusCounts;
  total_order_growth_percentage: number;
  total_user_growth_percentage: number | null;
  total_revenue_growth_percentage: number;
}


export interface LatestOrderData extends Order {
  // Extends the existing Order type from orders module
} 