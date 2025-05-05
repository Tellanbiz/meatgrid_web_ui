export interface StockProduct {
  id: string;
  name: string;
  unit_type: string;
}

export interface StockStore {
  id: string;
  name: string;
}

export enum StockStatus {
  InStock = "instock",
  Sold = "sold",
  Reclaim = "reclaim",
  Processed = "processed",
  Migrated = "migrated",
}

export interface Stock {
  id: string;
  quantity: number;
  status: StockStatus;
  product: StockProduct;
  store?: StockStore;
  created_at: string;
}
