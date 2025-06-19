export 	interface Purchasable {
    id: number
    name: string
    description: string
    unit_type: string
    created_at:string
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

export interface CreateOrderPurchaseParams {
    supplier_id: string;
    items: {
      product_id: number;
      unit_of_issue: number;
      unit_cost: number;
    }[];
}
