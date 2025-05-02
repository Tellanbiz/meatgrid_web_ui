export interface CreateRecipeRequest {
  name: string;
  image: string;
  short_description: string;
  description: string;
  product_ids: string[];
}