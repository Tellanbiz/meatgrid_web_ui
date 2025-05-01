import { CreateProductRequest } from "./CreateProductRequest";

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}
