export interface ProductResponse {
  id: string;
  name: string;
  unit_type: string;
}

export interface StoreResponse {
  id: string;
  name: string;
}

export interface StoreProductResponse {
  id: string;
  quantity: number;
  status: string;
  product: ProductResponse;
  store: StoreResponse;
  created_at: string;
}
