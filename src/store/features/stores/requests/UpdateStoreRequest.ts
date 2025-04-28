import { CreateStoreRequest } from "./CreateStoreRequest";

export interface UpdateStoreRequest extends CreateStoreRequest {
  id: string;
}