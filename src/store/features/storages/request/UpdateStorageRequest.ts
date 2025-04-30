import { CreateStorageRequest } from "./CreateStorageRequest";

export interface UpdateStorageRequest extends Partial<CreateStorageRequest> {
  id: string;
}
