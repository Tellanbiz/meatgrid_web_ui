export interface StockProduct {
  id: string;
  name: string;
  unit_type: string;
}

export interface StockStore {
  id: string;
  name: string;
}

export interface Stock {
  id: string;
  quantity: number;
  status: string;
  product: StockProduct;
  store?: StockStore;
  created_at: string;
}
