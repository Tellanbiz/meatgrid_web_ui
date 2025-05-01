export interface CreateProductRequest {
  name: string;
  description: string;
  regular_price: number;
  unit_type: string;
  weight: number;
  allow_cart_weight: boolean;
  category_id: string;
  tag_id: string;
  images: string[];
  is_product: boolean;
  is_raw_material: boolean;
  minimum_stock_quantity: number;
}
