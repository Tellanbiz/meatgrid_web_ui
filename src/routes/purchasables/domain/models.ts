export interface Purchasable {
  id: number;
  name: string;
  description: string;
  unit_type: string;
  created_at: string; // ISO date string
  stock_info: {
    total_damaged: number;
    total_instock: number;
    total_migrated: number;
    total_processed: number;
    total_reclaim: number;
    total_sold: number;
  };
}


export interface PurchasableOrder {
  id: number;
  created_at: string;
  supplier: {
    id: string;
    full_name: string;
    email: string;
  };
  user: {
    id: string;
    full_name: string;
  };
  items: {
    id: number;
    product: {
      id: number;
      name: string;
      unit_type: string;
    };
    unit_cost: number;
    unit_of_issue: number;
  }[];
}

export interface CreatePurchaseParams {
    id?: number
    name: string, 
    description: string, 
    unit_type: 'grams'| 'kilograms'|'liters'| 'pieces'
}

export interface ProcessPurchaseParams {
  id?: number
  name: string, 
  description: string, 
  unit_type: 'grams'| 'kilograms'|'liters'| 'pieces'
}

export interface CreateOrderPurchaseParams {
    supplier_id: string;
    storage_type_id: string;
    store_id: string;
    items: {
      product_id: number;
      unit_of_issue: number;
      unit_cost: number;
    }[];
}

export interface PurchasableStock {
  id: string;
  quantity: number;
  status: string;
  purchasable?: {
    id: number;
    name: string;
    unit_type: string;
  };
  product?: {
    id: number;
    name: string;
    unit_type: string;
  };
  store?: {
    id: string;
    name: string;
  };
  created_at: string; // ISO 8601 timestamp
}



