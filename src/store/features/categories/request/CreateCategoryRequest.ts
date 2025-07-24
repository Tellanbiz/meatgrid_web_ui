export interface CreateCategoryRequest {
  image: string;
  name: string;
  description: string;
  parent_id: string;
  active: boolean;
}
