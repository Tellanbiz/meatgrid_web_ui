export interface TransferStockProductItem {
  product_id: string;
  quantity: number;
}

export interface TransferStockRequest {
  store_id: string;
  receiving_store_id: string;
  storage_type: string;
  products: TransferStockProductItem[];
}