export interface PurchasableInventoryItemParams {
  product_id: number;
  unit_of_issue: number; // matches Quantity in Go struct
}

export interface PurchasableProductionItemParams {
  product_id: string;
  unit_of_issue: number; // matches Quantity in Go struct
}

export interface PurchasableProcessParams {
  store_id: string; // UUID as string
  storage_type_id: string; // UUID as string
  materials: PurchasableInventoryItemParams[];
  finished_products: PurchasableInventoryItemParams[];
} 

export interface PurchasableProductionParams {
  store_id: string; // UUID as string
  storage_type_id: string; // UUID as string
  materials: PurchasableInventoryItemParams[];
  products: PurchasableProductionItemParams[];
} 