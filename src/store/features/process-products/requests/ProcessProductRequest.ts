export interface ProcessedProductPayload {
  product_id: string;
  quantity: number;
}

export interface RawMaterialPayload {
  product_id: string;
  quantity: number;
}

export interface ProcessProductRequest {
  store_id: string;
  storage_type_id: string;
  suppliers: string[];
  expiry_at: string;
  auto_generate_batch_number?: boolean;
  batch_number?: string;
  raw_materials: RawMaterialPayload[];
  processed_products: ProcessedProductPayload;
}
