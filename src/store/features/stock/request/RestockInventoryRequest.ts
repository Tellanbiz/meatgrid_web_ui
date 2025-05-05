export interface RestockInventoryRequest {
  store_id: string;
  storage_type_id: string;
  supplier_id?: string;
  products: {
    product_id: string;
    quantity: number;
  }[];
}
