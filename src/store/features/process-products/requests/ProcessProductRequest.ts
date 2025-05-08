import { ProcessedProduct, RawMaterial } from "../processProductTypes";

export interface ProcessProductRequest {
  suppliers: string[];
  raw_materials: RawMaterial[];
  processed_products: ProcessedProduct[];
}
