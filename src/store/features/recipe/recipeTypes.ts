export interface Recipe {
  id: string;
  image: string;
  name: string;
  short_description: string;
}

export interface RecipeWithDetails extends Recipe {
  description: string;
  product_ids: string[];
  created_at: string;
}
