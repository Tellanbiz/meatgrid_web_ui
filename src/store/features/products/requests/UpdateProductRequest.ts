import { CreateProductRequest } from "./CreateProductRequest";

export interface UpdateProductRequest {
  id: string;
  data: Partial<CreateProductRequest>;
}