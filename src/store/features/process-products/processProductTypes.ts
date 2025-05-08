export interface RawMaterial {
  quantity: number;
  product_id: string;
  store_id: string;
}

export interface ProcessedProduct extends RawMaterial {
  storage_type_id: string;
}
