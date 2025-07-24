export interface UpdateCategoryRequest {
  id: string;
  image?: string;
  name?: string;
  description?: string;
  parent_id?: string;
  active?: boolean;
}
