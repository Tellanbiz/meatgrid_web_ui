export interface EditRecipeRequest {
  id: string;
  image: string;
  name: string;
  short_description: string;
  description: string;
  product_ids: string[];
}
