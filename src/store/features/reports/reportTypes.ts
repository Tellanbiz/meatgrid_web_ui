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
