export interface ProductBatch {
  id: string;
  batch_number: string;
  expiry_at: string; // ISO 8601 date string
  chilled_at: string; // ISO 8601 date string
  frozen_at: string; // ISO 8601 date string
  bar_code_url: string;
  qr_code_url: string;
  products: {
    product_id: string;
    product_name: string;
    unit_type: string;
  }[];
  total_quantity: number;
  storage_type: string;
  store: string;
}

export interface ProcessingParams {
  store_id: string;
  storage_type_id: string;
  expiry_at: string; // ISO 8601 date string
  frozen_at: string;
  chilled_at: string;
  purchasable_product_items: number[];
  processed_products: {
    product_id: string;
    quantity: number;
  }[];
}

export interface AvailableProductItem {
  id: string;
  name: string;
  unit_type: string;
}