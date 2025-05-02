export interface Product {
  id: string;
  images: string[];
  name: string;
  description: string;
  weight: number;
  minimum_stock_quantity: number;
  unit_type: string;
  category_id: string;
  tag_id: string | null;
  allow_cart_weight: boolean;
  category_tag: string;
  regular_price: number;
  promotional_price: number;
  is_raw_material: boolean;
  is_product: boolean;
  stock_info: {
    total_instock: number;
    total_reclaim: number;

    total_correction: number;
    total_damaged: number;
    total_migrated: number;
    total_processed: number;
    total_sold: number;
  };
}
